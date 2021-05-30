<template>
    <div 
        class="puzzle-preview" 
        ref="puzzlepreview"
        :style="{height: `${height}px`}"
    >
        <ul v-if="height > 0">
            <li 
                v-for="(row, i) in pattern" 
                :key="'row-' + i.toString()"
                :style="{height: `${100/pattern.length}%`}"
            >
                <ul>
                    <li 
                        v-for="(cell, j) in row" 
                        :key="'cell-' + i.toString() + '-' + j.toString()"
                        :style="{width: `${100/pattern[i].length}%`}"
                        :class="{active: cell != ' ' || (collisions && collisions[`${i}.${j}`] && collisions[`${i}.${j}`].length >= 1), error: collisions && collisions[`${i}.${j}`] && collisions[`${i}.${j}`].length >= 2}"
                    > 
                        {{cell.toUpperCase()}}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        pattern: Array,
        collisions: null
    },
    data () {
        return {
            height: 0
        }
    },
    methods: {
        mapHeight (scope) {
            setTimeout(() => {
                if(scope.$refs['puzzlepreview'] && scope.pattern.length > 0){
                    scope.height = this.$refs['puzzlepreview'].getBoundingClientRect().width * (scope.pattern.length / scope.pattern[0].length);
                }
                else {
                    scope.mapHeight(scope);
                }
            }, 100);
        }
    },
    mounted () {
        this.mapHeight(this);
    }
}
</script>

<style>

</style>