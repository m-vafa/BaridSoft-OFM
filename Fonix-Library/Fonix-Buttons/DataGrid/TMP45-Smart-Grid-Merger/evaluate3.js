// DG2 -> DG4; replaces existing DG4 rows and their entered statuses.
var source = $scope.data.DG2 || [];
if (!source.length) { alert("دیتاگرید DG2 خالی است."); return; }
$scope.data.DG4 = source.filter(function(row) {
  return row.Selectedfieldstatuss2 === "ارجاع به امکان سنجی تولید";
}).map(function(row) { return {
  Productdescription4: row.Productdescription2,
  Brand4: row.Brand2,
  Productcodee4: row.Productcodee2
}; });
alert("تعداد " + $scope.data.DG4.length + " ردیف به DG4 منتقل شد.");
