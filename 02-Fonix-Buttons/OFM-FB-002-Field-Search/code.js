(function () {
    var formName = String($scope.data.Latintitleform || "").trim();
    var fieldValue = $scope.data.Fieldtitle;
    var fieldName = "";
    if (fieldValue && typeof fieldValue === "object") {
        fieldName = String(fieldValue.Propertynameee || fieldValue.value || fieldValue.key || "").trim();
    } else {
        fieldName = String(fieldValue || "").trim();
    }
    var searchText = String($scope.data.Searchfilter || "").trim().toLowerCase();
    var limit = 100;
    function report(message) {
        $scope.data.textareaField1 = message;
        if ($scope.$applyAsync) $scope.$applyAsync();
    }
    function toText(value) {
        if (value === undefined || value === null) return "";
        if (typeof value === "object") {
            try { return JSON.stringify(value); } catch(e) { return ""; }
        }
        return String(value);
    }
    if (!formName) { report("نام لاتین فرم مشخص نشده است."); return; }
    if (!fieldName) { report("لطفاً فیلد موردنظر را انتخاب کنید."); return; }
    var schemaFields = Array.isArray($scope.data.DG1) ? $scope.data.DG1 : [];
    var fieldExists = schemaFields.some(function(row) {
        return row.Propertynameee === fieldName;
    });
    if (!fieldExists) {
        report("فیلد " + fieldName + " در DG1 یافت نشد."); return;
    }
    report("در حال جستجوی رکوردهای فرم " + formName);
    FonixUtils.getInternalResourceData(formName, "1=1", limit)
    .then(function(res) {
        var records = res && Array.isArray(res.Data) ? res.Data : [];
        var results = [];
        var matched = 0, missing = 0;
        records.forEach(function(record) {
            var data = record.data || {};
            var hasField = Object.prototype.hasOwnProperty.call(data, fieldName);
            var value = hasField ? data[fieldName] : "";
            var textValue = toText(value);
            if (!hasField) missing++;
            var isMatch = !searchText ||
                textValue.toLowerCase().indexOf(searchText) !== -1;
            if (!isMatch) return;
            matched++;
            results.push({
                Propertynameee0: fieldName,
                valueee0: textValue,
                Sn0: record.Serial || "",
                FormVersion0: data.FormVersion || ""
            });
        });
        if (!Array.isArray($scope.data.DG0)) $scope.data.DG0 = [];
        $scope.data.DG0.length = 0;
        results.forEach(function(row) { $scope.data.DG0.push(row); });
        report(JSON.stringify({
            Status: "Success",
            FormName: formName,
            FieldName: fieldName,
            Searchfilter: searchText,
            FilterMode: searchText ? "Contains" : "AllRecords",
            RecordsChecked: records.length,
            MatchedRecords: matched,
            MissingFieldCount: missing,
            GridRows: results.length,
            RequestedLimit: limit
        }, null, 2));
    }, function(error) {
        report("خطا در جستجوی رکوردها:\n" +
            (error && error.message ? error.message : String(error)));
    });
})();