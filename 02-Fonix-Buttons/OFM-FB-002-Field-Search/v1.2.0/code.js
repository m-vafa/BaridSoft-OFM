// OFM-FB-002 v1.2.0 — recursive field search with historical record version
// Verified on tmp100: 7 records, 4 matched records, 38 values, 4 version requests, 0 errors.
(function () {
    var formName = String($scope.data.Latintitleform || "").trim();
    var selected = $scope.data.Fieldtitle;
    var fieldName = selected && typeof selected === "object"
        ? String(selected.Propertynameee || selected.value || selected.key || "").trim()
        : String(selected || "").trim();
    var searchText = String($scope.data.Searchfilter || "").trim().toLowerCase();
    var limit = 100;

    function report(value) {
        $scope.data.textareaField1 = typeof value === "string" ? value : JSON.stringify(value, null, 2);
        if ($scope.$applyAsync) $scope.$applyAsync();
    }
    function toText(value) {
        if (value === null || value === undefined) return "";
        if (typeof value === "object") {
            try { return JSON.stringify(value); } catch (e) { return ""; }
        }
        return String(value);
    }
    function describeError(e) {
        try {
            return JSON.stringify({
                status: e && e.status,
                message: e && e.message,
                responseData: e && e.data,
                keys: e && typeof e === "object" ? Object.keys(e) : []
            });
        } catch (ex) { return String(e); }
    }
    if (!formName || !fieldName) {
        report("نام لاتین فرم و نام فیلد الزامی است.");
        return;
    }
    var schemaFields = Array.isArray($scope.data.DG1) ? $scope.data.DG1 : [];
    if (!schemaFields.some(function (r) { return r && r.Propertynameee === fieldName; })) {
        report("فیلد " + fieldName + " در DG1 یافت نشد.");
        return;
    }
    function scan(node, path, found, visited, stats) {
        if (!node || typeof node !== "object" || visited.indexOf(node) !== -1) return;
        visited.push(node);
        Object.keys(node).forEach(function (key) {
            var value = node[key];
            var currentPath = path ? path + "." + key : key;
            if (key === fieldName) {
                stats.found++;
                var textValue = toText(value);
                if (!searchText || textValue.toLowerCase().indexOf(searchText) !== -1) {
                    found.push({ value: textValue, path: currentPath });
                }
            }
            if (value && typeof value === "object") scan(value, currentPath, found, visited, stats);
        });
    }
    function fetchVersion(record) {
        return new Promise(function (resolve) {
            if (!record.Id || !record.FormTypeId) {
                resolve({ version: "", error: "Missing record.Id or record.FormTypeId" });
                return;
            }
            var url = "/Fonix/OFM/api/Form/Get/?formTypeId=" +
                encodeURIComponent(record.FormTypeId) + "&Id=" + encodeURIComponent(record.Id);
            Http.get(url).then(function (response) {
                var body = response && response.data !== undefined ? response.data : response;
                var entity = body && body.Entity;
                if (body && body.Succeeded !== false && entity &&
                    entity.Version !== undefined && entity.Version !== null) {
                    resolve({ version: entity.Version, error: null });
                } else {
                    resolve({ version: "", error: "Entity.Version missing or unsuccessful response" });
                }
            }, function (error) {
                resolve({ version: "", error: describeError(error) });
            });
        });
    }
    report("در حال جستجوی رکوردهای فرم " + formName);
    FonixUtils.getInternalResourceData(formName, "1=1", limit).then(function (res) {
        var records = res && Array.isArray(res.Data) ? res.Data : [];
        var rows = [], matchedRecords = 0, recordsWithoutField = 0;
        var recordsFilteredOut = 0, versionRequests = 0, versionErrors = [];
        var index = 0;
        function finish() {
            if (!Array.isArray($scope.data.DG0)) $scope.data.DG0 = [];
            $scope.data.DG0.length = 0;
            rows.forEach(function (r) { $scope.data.DG0.push(r); });
            report({
                Status: "Success", ScriptVersion: "1.2.0",
                FormName: formName, FieldName: fieldName,
                Searchfilter: searchText, FilterMode: searchText ? "Contains" : "AllValues",
                RecordsChecked: records.length, MatchedRecords: matchedRecords,
                RecordsWithoutField: recordsWithoutField,
                RecordsFilteredOut: recordsFilteredOut,
                GridRows: rows.length, VersionRequests: versionRequests,
                VersionErrors: versionErrors, RequestedLimit: limit
            });
        }
        function next() {
            if (index >= records.length) { finish(); return; }
            var record = records[index++];
            var matches = [], stats = { found: 0 };
            scan(record.data || {}, "data", matches, [], stats);
            if (!stats.found) recordsWithoutField++;
            if (!matches.length) {
                if (stats.found) recordsFilteredOut++;
                next();
                return;
            }
            matchedRecords++;
            versionRequests++;
            fetchVersion(record).then(function (info) {
                if (info.error) versionErrors.push({
                    Serial: record.Serial || "", RecordId: record.Id || "", Error: info.error
                });
                matches.forEach(function (m) {
                    rows.push({
                        Propertynameee0: fieldName, valueee0: m.value,
                        Sn0: record.Serial || "", FieldPath0: m.path,
                        FormVersion0: info.version
                    });
                });
                next();
            });
        }
        next();
    }, function (error) {
        report({ Status: "ResourceError", FormName: formName, Error: describeError(error) });
    });
})();