// DG2 -> DG3; replaces existing DG3 rows and their entered statuses.
var source = $scope.data.DG2 || [];
if (!source.length) { alert("دیتاگرید DG2 خالی است."); return; }
$scope.data.DG3 = source.filter(function(row) {
  return row.Selectedfieldstatuss2 === "ارجاع به امکان سنجی بازرگانی";
}).map(function(row) { return {
  Productdescription3: row.Productdescription2,
  Brand3: row.Brand2,
  Productcodee3: row.Productcodee2
}; });
alert("تعداد " + $scope.data.DG3.length + " ردیف به DG3 منتقل شد.");
