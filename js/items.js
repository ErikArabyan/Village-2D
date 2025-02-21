class MapItem {
	image = new Image()

	constructor(mapPosX, mapPosY, imgPosX, imgPosY, picWidth, picHeight, boundaryConfigs, imageSrc) {
		this.mapPosition = new Vector2(mapPosX * CONFIG.BLOCK_SIZE, mapPosY * CONFIG.BLOCK_SIZE)
		this.imgPosition = new Vector2(imgPosX * CONFIG.TILE_SIZE, imgPosY * CONFIG.TILE_SIZE)
		this.picWidth = picWidth * CONFIG.TILE_SIZE
		this.picHeight = picHeight * CONFIG.TILE_SIZE
		this.height = this.picHeight - boundaryConfigs[0].height
		this.image.src = imageSrc    
		this.boundaries = boundaryConfigs.map(
			config =>
			new Boundary({
				mapPosition: {
					x: this.mapPosition.x + config.x,
					y: this.mapPosition.y + config.y,
				},
				action: config.action ? config.action : 1,
				width: config.width,
				height: config.height,
			})
		)
	}

	draw() {
    // this.boundaries[0].draw()
    if (this.boundaries[1]) {
      // this.boundaries[1].draw()
    }
		ctx.drawImage(this.image, this.imgPosition.x, this.imgPosition.y, this.picWidth, this.picHeight, this.mapPosition.x, this.mapPosition.y, this.picWidth, this.picHeight)
	}
}

class Home extends MapItem {
	constructor(mapPosX, mapPosY, action) {
		super(
			mapPosX,
			mapPosY,
			12, // imgPosition X, Y
			4,
			8, // picWidth, picHeight
			8,
			[
				{ x: 9, y: 36, width: 45, height: 26 },
				{ x: 22, y: 62, width: 18, height: 1, action: action },
			], // bsize
			'assets/map_items/TopdownForest-Props.png'
		)
	}
}

class Tree extends MapItem {
	constructor(mapPosX, mapPosY) {
		super(
			mapPosX,
			mapPosY,
			12, // imgPosition X, Y
			0,
			4, // picWidth, picHeight
			4,
			[{ x: 6, y: 20, width: 18, height: 12 }], // bsize
			'assets/map_items/TopdownForest-Props.png'
		)
	}
}
