process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function capitalisation(string) {
  if (string === null) return null;
  return string.charAt(0) + string.slice(1).toLocaleLowerCase("tr");
}
async function fetchsite(link) {
  res = await fetch(link);
  data = await res.json();
  console.log("here");
  return await data.map(function (sonuc) {
    var toplamoy = sonuc.gecerli_OY_TOPLAMI;
    var obj = {
      Il: sonuc.il_ADI,
      Ilce: sonuc.ilce_ADI,
      AKP: (sonuc.parti1_ALDIGI_OY * 100) / toplamoy,
      CHP: (sonuc.parti6_ALDIGI_OY * 100) / toplamoy,
      HDP: (sonuc.parti5_ALDIGI_OY * 100) / toplamoy,
      MHP: (sonuc.parti2_ALDIGI_OY * 100) / toplamoy,
      IYI: (sonuc.parti8_ALDIGI_OY * 100) / toplamoy,
    };
    return obj;
  });
}

async function startf() {
  var arr = [];
  for (var index = 1; index < 82; index++) {
    var link =
      "http://sonuc.ysk.gov.tr/api/getSecimSandikSonucList?secimId=49002&secimTuru=8&ilId=".concat(
        index,
        "&yurtIciDisi=1&sandikRumuzecimCevresiId=271620rg&suTuru=2"
      );
    res = await fetchsite(link);
    arr = arr.concat(res);
  }
  return arr;
}

function toCsv(itemarray) {
  return [
    ["Il", "Ilce", "AKP", "CHP", "HDP", "MHP", "IYI"],
    ...itemarray.map((item) => [
      capitalisation(item.Il),
      capitalisation(item.Ilce),
      item.AKP,
      item.CHP,
      item.HDP,
      item.MHP,
      item.IYI,
    ]),
  ]
    .map((e) => e.join(","))
    .join("\n");
}

startf().then((res) => {
  console.log(toCsv(res));
});
