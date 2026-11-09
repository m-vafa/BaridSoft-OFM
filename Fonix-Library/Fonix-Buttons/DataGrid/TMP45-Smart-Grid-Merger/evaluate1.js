// DG1 -> DG2; replaces destination; backup existing data before rerunning.
var source = $scope.data.DG1 || [];
if (!source.length) { alert("دیتاگرید DG1 خالی است."); return; }
$scope.data.DG2 = source.map(function(row) { return {
  Productdescription2: row.Productdescription1,
  Brand2: row.Brand1,
  Productcodee2: row.Productcodee1
}; });
alert("تعداد " + $scope.data.DG2.length + " ردیف به DG2 منتقل شد.");
