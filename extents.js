var JSONStream = require('JSONStream');
var fs = require('fs');

var parser = JSONStream.parse([ 'features', /./ ]);
fs.createReadStream(__dirname + '/citylots.json').pipe(parser);

var extents = {
    north : -90,
    south : 90,
    west : 180,
    east : -180,
};

parser.on('data', function (x) {
    var points = x.geometry.coordinates[0];
    for (var i = 0; i < points.length; i++) {
        var lon = points[i][0];
        var lat = points[i][1];
        if (lon < extents.west) extents.west = lon;
        if (lon > extents.east) extents.east = lon;
        if (lat > extents.north) extents.north = lat;
        if (lat < extents.south) extents.south = lat;
    }
});

parser.on('end', function () {
    console.log(JSON.stringify(extents));
});
