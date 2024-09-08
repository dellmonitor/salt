function xoshiro128ss(a, b, c, d) {
  return function() {
    let t = b << 9, r = b * 5;
    r = (r << 7 | r >>> 25) * 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = d << 11 | d >>> 21;
    return (r >>> 0) / 4294967296;
  }
}

const seedgen = () => (Math.random()*2**32)>>>0;
// const getRand = xoshiro128ss(seedgen(), seedgen(), seedgen(), seedgen());

const getRandNE = xoshiro128ss(seedgen(), 0, 0, 0);
const getRandNW = xoshiro128ss(0, seedgen(), 0, 0);
const getRandSW = xoshiro128ss(0, 0, seedgen(), 0);
const getRandSE = xoshiro128ss(0, 0, 0, seedgen(), );
