<template>
    <ul 
        class="game-pattern"
        :class="`game-pattern-${structure.length}`"
    >
        <li 
            v-for="(row, i) in structure" 
            :key="'row-'+i.toString()"
            :style="{width: '100%', height: `${100/structure.length}%`}"
        >
            <ul>
                <li 
                    v-for="(cell, j) in row" 
                    :key="'cell-'+j.toString()+'-'+i.toString()"
                    :class="{'full-cell': cell > 0}"
                    :style="{width: `${100/structure[0].length}%`, height: `${100/structure.length}%`}"
                >
                    
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        structure: Array
    }
}
</script>

<style lang="scss" scoped>
ul.game-pattern, ul.game-pattern ul{
    display:flex;
    margin:0;
    padding:0;
    width: 50px;
    height: 50px;
    flex-direction: column;
    ul{
        flex-direction: row;
    }
    li{
        display:inline-block;
        margin:0;
        padding:0;
        background-color: #ffffff;
        box-shadow: 0 0 0 1px rgba(0,0,0,.5);
        &.full-cell{
            background-color:#000000;
        }
    }
}
</style>