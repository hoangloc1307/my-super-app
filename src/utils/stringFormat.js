export function numberWithCommas(x) {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function numberWithSizeUnit(x) {
    if (x >= 1048576) {
        return (Math.round((x / 1048576 + Number.EPSILON) * 100) / 100)?.toString() + ' MB';
    } else if (x >= 1024) {
        return (Math.round((x / 1024 + Number.EPSILON) * 100) / 100)?.toString() + ' KB';
    }
    return x;
}
