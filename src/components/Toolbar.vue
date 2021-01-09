<template>
	<div>
		<input type="checkbox" name="edit" id="editCP_btn" @change="editCPClick()" />
		<label for="editCP_btn">编辑模式</label>
		<span id="editingToolbar" style="display: none;">
			<input type="radio" name="role" value=1 id="switchBlackCP" />
			<label for="switchBlackCP">黑棋</label>
			<input type="radio" name="role" value=0 id="switchWhiteCP" />
			<label for="switchWhiteCP">白棋</label>
			<button @click="clear()">清空</button>
		</span>
	</div>
</template>

<script>
import * as d3 from 'd3'

export default {
	name: 'Toolbar',
	data() {
		return {
			isEditingMode: false
		}
	},
	props: {
		chessPieces: Object,
		svg: Object,
		currentRole: Number
	},
	computed: {
		getSvg: function() {
			return this.svg;
		},
		getCurrentRole: function() {
			return this.currentRole;
		}
	},
	methods: {
		removeChessPieceHandler() {
			if (this.isEditingMode) {
				event.target.remove();
			}
		},
		editCPClick() {
			this.isEditingMode = event.target.checked;
			this.$emit("editing", this.isEditingMode);
			if (this.isEditingMode) {
				this.getSvg.attr('class', 'editingMode')
				d3.select('#editingToolbar').style('display', 'inline');
				if (this.getCurrentRole === 1) {
					d3.select('#switchBlackCP').attr('checked', 'checked');
				} else {
					d3.select('#switchWhiteCP').attr('checked', 'checked');
				}

				d3.selectAll('.CP_black,.CP_white').on('click', this.removeChessPieceHandler);
			} else {
				this.getSvg.attr('class', null)
				d3.select('#editingToolbar').style('display', 'none');
				d3.selectAll('.CP_black,.CP_white').on('click', null);
			}
		},
		clear() {
			d3.selectAll('.pieces').remove()
			this.$root.$emit("active", JSON.stringify({
				clear: true
			}))
		}
	}
}

</script>
