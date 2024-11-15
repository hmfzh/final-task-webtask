function hitungTotalInvestasi(modalAwal) {
    const deposito = 350000000;
    const obligasi = 650000000;
    const sisa = modalAwal - deposito - obligasi;
    const sahamA = sisa * 0.35;
    const sahamB = sisa - sahamA;

    const keuntunganDeposito = 0.035;
    const keuntunganObligasi = 0.13;
    const keuntunganSahamA = 0.145;
    const keuntunganSahamB = 0.125;
    const tahun = 2;

    function hitungNilaiAkhir(modalAwal, tingkatKeuntungan, tahun) {
        return modalAwal * Math.pow(1 + tingkatKeuntungan, tahun);
    }
    const nilaiAkhirDeposito = hitungNilaiAkhir(deposito, keuntunganDeposito, tahun);
    const nilaiAkhirObligasi = hitungNilaiAkhir(obligasi, keuntunganObligasi, tahun);
    const nilaiAkhirSahamA = hitungNilaiAkhir(sahamA, keuntunganSahamA, tahun);
    const nilaiAkhirSahamB = hitungNilaiAkhir(sahamB, keuntunganSahamB, tahun);

    const totalNilai = nilaiAkhirDeposito + nilaiAkhirObligasi + nilaiAkhirSahamA + nilaiAkhirSahamB;

    const totalNilaiRupiah = totalNilai.toLocaleString('id-ID');

    console.log(`Total : Rp ${totalNilaiRupiah}`);
}

hitungTotalInvestasi(1000000000);