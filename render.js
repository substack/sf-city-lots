var JSONStream = require('JSONStream');
var fs = require('fs');

var Canvas = require('canvas');
var canvas = new Canvas(4096, 4096);
var ctx = canvas.getContext('2d');

var parser = JSONStream.parse([ 'features', /./ ]);
var s = fs.createReadStream(__dirname + '/citylots.json');
s.pipe(parser);

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

var extents = JSON.parse(fs.readFileSync(__dirname + '/extents.json'));

function toPixel (lat, lon) {
    var x = (lon - extents.west) / (extents.east - extents.west);
    var y = (lat - extents.south) / (extents.north - extents.south);
    return {
        x : Math.floor(x * canvas.width),
        y : Math.floor((1 - y) * canvas.height),
    };
}

parser.on('data', function (x) {
    var points = x.geometry.coordinates[0];
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    
    points.forEach(function (pt) {
        var px = toPixel(pt[1], pt[0]);
        ctx.lineTo(px.x, px.y);
    });
    ctx.stroke();
});

parser.on('end', function () {
    clearInterval(iv);
    fs.writeFileSync('map.png', canvas.toBuffer());
});
