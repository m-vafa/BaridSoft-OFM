(function () {
    var formName = String($scope.data.Latintitleform || "").trim();
    var gridName = "DG1";
    var reportName = "textareaField1";
    var apiBase = "/Fonix/OFM/api/FormType/Get?Id=";
    function report(message) {
        $scope.data[reportName] = message;
        if ($scope.$applyAsync) $scope.$applyAsync();
    }
    function asText(value) {
        if (value === undefined || value === null) return "";
        if (typeof value === "object") {
            try { return JSON.stringify(value); } catch (e) { return ""; }
        }
        return String(value);
    }
    function parseJson(value) {
        if (typeof value === "string") return JSON.parse(value);
        return value;
    }
    function errorText(error) {
        if (!error) return "خطای نامشخص";
        if (error.data) return asText(error.data);
        return error.message || error.statusText || asText(error);
    }
    if (!formName) { report("نام لاتین فرم مشخص نشده است."); return; }
    if (typeof Http === "undefined" || typeof Http.get !== "function") {
        report("تابع Http.get در دسترس نیست."); return;
    }
    report("در حال دریافت اطلاعات فرم: " + formName);
    FonixUtils.getInternalResourceData(formName, "1=1", 100)
    .then(function(res) {
        var records = res && Array.isArray(res.Data) ? res.Data : [];
        if (!records.length) { report("هیچ رکوردی برای فرم " + formName + " پیدا نشد."); return; }
        var formTypeId = "";
        records.some(function(record) {
            if (record.FormTypeId) { formTypeId = record.FormTypeId; return true; }
            return false;
        });
        if (!formTypeId) { report("FormTypeId در رکوردها یافت نشد."); return; }
        report("FormTypeId: " + formTypeId + "\nدر حال دریافت Schema...");
        var url = apiBase + encodeURIComponent(formTypeId);
        var request;
        try { request = Http.get(url); }
        catch(e) { report("خطا در فراخوانی Http.get:\n" + errorText(e)); return; }
        if (!request || typeof request.then !== "function") {
            report("خروجی Http.get از نوع Promise نیست."); return;
        }
        request.then(function(response) {
            try {
                var result = response;
                if (response && response.data !== undefined) result = response.data;
                result = parseJson(result);
                var entity = result && (result.Entity || result.entity);
                if (!entity) throw new Error("Entity در پاسخ سرویس وجود ندارد.");
                if (entity.LatinTitle &&
                    String(entity.LatinTitle).toLowerCase() !== formName.toLowerCase()) {
                    throw new Error("نام لاتین فرم دریافتی مطابقت ندارد: " + entity.LatinTitle);
                }
                var schema = parseJson(entity.FormSchema);
                if (!schema || !Array.isArray(schema.components)) {
                    throw new Error("FormSchema معتبر نیست.");
                }
                var rows = [];
                var visited = [];
                function scan(list, parentPath, parentKey, depth) {
                    if (!Array.isArray(list)) return;
                    list.forEach(function(c) {
                        if (!c || typeof c !== "object") return;
                        if (visited.indexOf(c) !== -1) return;
                        visited.push(c);
                        var key = c.key || "";
                        var path = key
                            ? (parentPath ? parentPath + "." + key : key)
                            : parentPath;
                        var required = !!(c.validate && c.validate.required === true);
                        var disabled = c.disabled === true;
                        var hidden = c.hidden === true;
                        var input = c.input === true;
                        if (key && input) {
                            rows.push({
                                Propertynameee: key,
                                Labelll: c.label || key,
                                valueee: "",
                                ComponentType: c.type || "",
                                FieldPath: path,
                                ParentKey: parentKey || "",
                                DefaultValue: asText(c.defaultValue),
                                RequiredField: required,
                                DisabledField: disabled,
                                HiddenField: hidden,
                                InputField: input,
                                ComponentLevel: depth,
                                DescriptionField: asText(c.description)
                            });
                        }
                        if (Array.isArray(c.components))
                            scan(c.components, path, key || parentKey, depth + 1);
                        if (Array.isArray(c.columns))
                            c.columns.forEach(function(col) {
                                if (col && Array.isArray(col.components))
                                    scan(col.components, path, key || parentKey, depth + 1);
                            });
                        if (Array.isArray(c.rows))
                            c.rows.forEach(function(r) {
                                if (!Array.isArray(r)) return;
                                r.forEach(function(cell) {
                                    if (cell && Array.isArray(cell.components))
                                        scan(cell.components, path, key || parentKey, depth + 1);
                                });
                            });
                    });
                }
                scan(schema.components, "", "", 0);
                if (!Array.isArray($scope.data[gridName])) $scope.data[gridName] = [];
                $scope.data[gridName].length = 0;
                rows.forEach(function(item) { $scope.data[gridName].push(item); });
                report(JSON.stringify({
                    Status: "Success",
                    FormName: formName,
                    FormTypeId: formTypeId,
                    FormVersion: entity.LastVersion,
                    RootComponents: schema.components.length,
                    ExtractedComponents: rows.length,
                    RequiredCount: rows.filter(function(r) { return r.RequiredField; }).length,
                    HiddenCount: rows.filter(function(r) { return r.HiddenField; }).length,
                    DisabledCount: rows.filter(function(r) { return r.DisabledField; }).length
                }, null, 2));
            } catch(error) { report("خطا در پردازش Schema:\n" + errorText(error)); }
        }, function(error) { report("خطا در دریافت Schema از سرویس:\n" + errorText(error)); });
    }, function(error) { report("خطا در دریافت FormTypeId:\n" + errorText(error)); });
})();