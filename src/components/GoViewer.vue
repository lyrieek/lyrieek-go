<template>
	<div>
		<div id="container"></div>
		<Toolbar v-bind:currentRole="currentRole" v-bind:chessPieces="chessPieces" v-bind:svg="svg" @editing="changeEditing" />
		<SocketBar v-bind:userName="'u'+Math.round(Math.random()*0xfff)" />
	</div>
</template>

<script>
import * as d3 from 'd3'
import dataProcess from '../services/dataProcess'
import Toolbar from './Toolbar.vue'
import SocketBar from './SocketBar.vue'

export default {
	name: 'GoViewer',
	components: {
		Toolbar,
		SocketBar,
	},
	data() {
		return {
			socket: null,
			chessPieces: Object.create(null),
			currentRole: 1, //1: black, 0:white
			svg: null,
			isEditingMode: false
		}
	},
	props: {
		msg: String
	},
	methods: {
		downChessPiece() {
			this.$root.$emit("active", JSON.stringify({
				x: this.chessPieces.x,
				y: this.chessPieces.y,
				role: this.currentRole,
			}))
			const chessPiece = this.rendererChessPiece({
				role: this.currentRole,
				noMove: true
			})
			this.chessPieces.current = chessPiece;
		},
		rendererChessPiece(dataItem) {
			const pieces = this.chessPieces.selecting.clone()
			if (!dataItem.noMove) {
				pieces.attr('cx', dataItem.x)
				pieces.attr('cy', dataItem.y)
			}
			if (dataItem.role === 1) {
				pieces.attr('class', 'pieces CP_black')
				pieces.attr('fill', '#000')
			} else {
				pieces.attr('class', 'pieces CP_white')
				pieces.attr('fill', '#FFF')
			}
			pieces.style('display', undefined)
			if (!this.isEditingMode) {
				this.currentRole = Math.abs(this.currentRole - 1)
				return pieces;
			}
			pieces.on('click', this.removeChessPieceHandler)
			return pieces
		},
		changeEditing(v) {
			this.isEditingMode = v
		}
	},
	mounted() {
		const width = 190 * 3;
		const height = 190 * 3;
		const padding = 25;
		let way = 19;

		this.svg = d3.select('#container')
			.append('svg')
			.attr('width', width + padding * 2 + 'px')
			.attr('height', height + padding * 2 + 'px');


		for (let y = 0; y < way; y++) {
			let gridLineXArray = [];
			let gridLineYArray = [];

			for (let x = 0; x < way; x++) {
				gridLineXArray.push([width / way * x + padding, width / way * y + padding])
				gridLineYArray.push([height / way * y + padding, height / way * x + padding])
			}

			this.svg.append("text")
				.attr("x", "0")
				.attr('y', height / way * (y + 1))
				.text(19 - y)

			this.svg.append("text")
				.attr("x", width / way * y + padding - 5)
				.attr('y', height + padding)
				.text(String.fromCharCode(65 + y))

			this.svg.append("path")
				.attr("class", "line")
				.attr('stroke', '#000')
				.attr("d", d3.line()(gridLineXArray));

			this.svg.append("path")
				.attr("class", "line")
				.attr('stroke', '#000')
				.attr("d", d3.line()(gridLineYArray));
		}

		//绘制星位 9路以上才绘制星位
		if (way > 9) {
			const star = [];
			star.push([3, 3]);
			star.push([way - 4, 3]);
			star.push([3, way - 4]);
			star.push([way - 4, way - 4]);
			//19路及以上才绘制全星位
			if (way >= 19) {
				const val = (way - way % 2) / 2;
				star.push([val, 3]);
				star.push([3, val]);
				star.push([val, val]);
				star.push([val, way - 4]);
				star.push([way - 4, val]);
			}
			for (const item of star) {
				this.svg.append("circle")
					// .attr('fill', '#000')
					.attr('r', '4')
					.attr("cx", width / way * item[0] + padding)
					.attr("cy", height / way * item[1] + padding);
			}
		}

		const calcChessPiecePoint = function(offset) {
			let compareNum = (offset - padding) % (width / way);
			if (compareNum > width / way / 2) {
				compareNum -= width / way;
			}
			return offset - compareNum;
		}


		this.chessPieces = Object.create(null)
		this.chessPieces.selecting = this.svg.append("circle")
			.attr('fill', '#777')
			.attr('r', 13)
			.attr('stroke', "black")
			.style('display', 'none')

		this.chessPieces.selecting.on('click', this.downChessPiece)
		this.svg.on("mousemove", (d) => {
			if (this.currentRole === 1) {
				this.chessPieces.selecting.attr('fill', '#555')
			} else {
				this.chessPieces.selecting.attr('fill', '#CCC')
			}
			// (d.offsetX - padding) / (width / way)
			this.chessPieces.x = calcChessPiecePoint(d.offsetX)
			this.chessPieces.y = calcChessPiecePoint(d.offsetY)
			this.chessPieces.selecting.attr('cx', this.chessPieces.x);
			this.chessPieces.selecting.attr('cy', this.chessPieces.y);
			// chessPieces.selecting.attr('cx', d.offsetX);

			this.chessPieces.selecting.style('display', undefined);
		})

		d3.selectAll('[name="role"]').on('click', (e) => {
			this.currentRole = Number(e.target.value);
		})

		dataProcess.pull((e) => {
			if (!e.length) {
				return
			}
			for (const dataItem of e) {
				this.rendererChessPiece(dataItem)
				// console.log(e);
			}
		})

		this.$root.$on("pull", (e) => {
			const data = JSON.parse(e)
			if (data.clear) {
				d3.selectAll('.pieces').remove()
			}
			if (!d3.select(`[cx="${data.x}"][cy="${data.y}"]`).empty()) {
				return
			}
			this.rendererChessPiece(data)
		})

	}
}

</script>

<style scoped>
div {
	text-align: center;
}

svg {
	background: ivory
}

svg.editingMode {
	background: lightyellow
}

</style>
