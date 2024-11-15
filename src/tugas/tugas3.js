function cetakPola(n) {
    for (let i = n; i >= 1; i--) {
        for (let j = 1; j <= n - i; j++) {
            process.stdout.write(" ");
        }

        for (let k = 1; k <= 2 * i - 1; k++) {
            if (k % 2 === 1) {
                process.stdout.write("#");
            } else {
                process.stdout.write("+");
            }
        }
        console.log();
    }
}

cetakPola(5);
