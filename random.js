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
const getRand = xoshiro128ss(seedgen(), seedgen(), seedgen(), seedgen());
