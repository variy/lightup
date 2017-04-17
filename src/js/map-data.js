var _levelData = [
	// 4*5. level 1
	{
		col: 4,
		time: 10,
		data: [
			'01100', 'A0010', '00011', 'A0010',
			'01010', 'A0001', '01010', 'A0010',
			'01010', '00101', '00101', '00101',
			'B1010', '01010', '00101', '01010',
			'01100', '01101', '01011', '01100'
		]
	},

	// level 5
	{
		col: 4,
		time: 50,
		data: [
			'A0010', '00111', '01010', 'A0001',
			'A0100', '00101', 'A0010', 'A0001',
			'01100', '01101', '00101', '00101',
			'01100', '01011', '01010', '01010',
			'A1000', 'B1001', '01101', '01100'
		]
	},
	// level 2
	{
		col: 4,
		time: 40,
		data: [
			'', 'B0100', '01110', '00011',
			'01100', '01101', '00110', '01010',
			'A0100', '01010', 'A0010', '00111',
			'A0010', '01001', 'A0001', '01010',
			'A0001', '00101', '01110', '00110'
		]
	},
	// level 3

	{
		col: 4,
		time: 30,
		data: [
			'A0010', '01101', '01010', 'A1000',
			'00011', '01011', '01010', 'A0010',
			'01110', '00101', '00111', 'A0100',
			'01100', 'B1000', '00111', '00110',
			'A1000', '00101', '01001', 'A0001'
		]
	},
	// level 4

	{
		col: 4,
		time: 30,
		data: [
			'A0100', '01100', 'A0100', 'A0100',
			'A0001', '01011', '01011', '00111',
			'01001', '01011', 'A0100', 'A0010',
			'A1000', 'B1011', '01110', 'A0001',
			'A0001', '01110', '01110', 'A0010'
		]
	}
];

var levelData = [];

for (var i = 0, len = _levelData.length; i < len; i++) {
	var obj = {
		data: []
	};
	obj.col = _levelData[i].col;
	obj.time = _levelData[i].time;
	obj.timeout = false;
	var dataItem = _levelData[i].data;
	for (var j = 0, inLen = dataItem.length; j < inLen; j++) {
		obj.data.push({
			sign: dataItem[j],
			rotate: 0,
			turnSign: dataItem[j],
			lighted: false
		});
	}

	levelData.push(obj);
}

module.exports = levelData;