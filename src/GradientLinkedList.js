import { getRandomGradient } from './CSSGradient.js'


class Node {
	constructor(value) {
		this.value = value
		this.next = undefined
		this.prev = undefined
	}
	
	setPrev(prev) {
		this.prev = prev 
	}
	
	setNext(next) {
		this.next = next 
	}
	
	getValue() {
		return this.value
	}
	
	getPrev() {
		return this.prev 
	}
	
	getNext() {
		return this.next 
	}
}

export default class GradientLinkedList{
	constructor (){
		this.actual = new Node(getRandomGradient())
		this.head = this.actual
	}
	
	getActualValue() {
		return this.actual.getValue()
	}
	
	addPrev() {
		const newNode = new Node(getRandomGradient())
		newNode.setNext(this.actual)
		this.actual.setPrev(newNode)
	}
	
	addNext() {
		const newNode = new Node(getRandomGradient())
		newNode.setPrev(this.actual)
		this.actual.setNext(newNode)
	}
	
	prev() {
		if (this.actual.getPrev() === undefined) this.addPrev()
		this.actual = this.actual.getPrev()
	}
	
	next() {
		if (this.actual.getNext() === undefined) this.addNext()
		this.actual = this.actual.getNext()
	}
	
}
