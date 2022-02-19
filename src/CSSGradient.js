export default class CSSGradient {
	constructor (type, colors) {
		this.type = type
		this.colors = colors
	}

	addColor(color) {
		this.colors.push(color)
	}

	removeColor(color) {
		if (this.colors.includes(color)) {
			const toRemove = this.colors.indexOf(color)
			this.colors.splice(toRemove, 1)
		}
	}
	
	getColorList() {
		return this.colors 
	}
	
	setColorList(colorList) {
		this.colors = colorList
	}
	
	getType() {
		return this.type
	}
	
	alternateType(){
		const [linear, radial] = ["linear-gradient", "radial-gradient"]
		this.type = this.type === linear ? radial : linear
	}
	
	getString() {
		const colorsFormat = this.colors.reduce((acumulate, currentValue) => acumulate + ", " + currentValue)
		return `${ this.type }(${ colorsFormat })`
	}
}

export const getRandomHexColor = () => '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')

export const getRandomGradient = () => {
	const colors = [getRandomHexColor(), getRandomHexColor()]
	const posibleTypes = ["linear-gradient", "radial-gradient"]
	const type = posibleTypes[Math.floor(Math.random() * posibleTypes.length)]
	return new CSSGradient(type, colors)
}
