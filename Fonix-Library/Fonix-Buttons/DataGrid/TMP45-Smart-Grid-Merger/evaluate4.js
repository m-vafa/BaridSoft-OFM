// Classification rule: only "عدم امکان تولید" in DG3 OR DG4 goes to DG6.
// All other DG2 products go to DG5. Duplicate source codes are blocked.
var d = $scope.data;
var source = d.DG2 || [], g3 = d.DG3 || [], g4 = d.DG4 || [];
if (!source.length) { alert("دیتاگرید DG2 خالی است."); return; }
function key(v) { return v == null ? "" : String(v).trim(); }
var rejected = Object.create(null), seen = Object.create(null);
function collect(rows, codeField, statusField) {
  rows.forEach(function(r) {
    var k = key(r[codeField]);
    if (k && r[statusField] === "عدم امکان تولید") rejected[k] = true;
  });
}
collect(g3, "Productcodee3", "Selectedfieldstatuss3");
collect(g4, "Productcodee4", "Selectedfieldstatuss4");
for (var i = 0; i < source.length; i++) {
  var k = key(source[i].Productcodee2);
  if (!k || seen[k]) {
    alert("کد کالا در DG2 خالی یا تکراری است؛ ردیف " + (i + 1));
    return;
  }
  seen[k] = true;
}
var out5 = [], out6 = [];
source.forEach(function(r) {
  var suffix = rejected[key(r.Productcodee2)] ? "6" : "5";
  var dest = {};
  dest["Productdescription" + suffix] = r.Productdescription2;
  dest["Brand" + suffix] = r.Brand2;
  dest["Productcodee" + suffix] = r.Productcodee2;
  (suffix === "6" ? out6 : out5).push(dest);
});
d.DG5 = out5;
d.DG6 = out6;
alert("ادغام انجام شد. DG5: " + out5.length + " | DG6: " + out6.length);
