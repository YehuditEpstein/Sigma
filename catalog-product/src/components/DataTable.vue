<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { formatPrice } from '../utils/format'

props: {
    data: { type: Array, required: true, default: [] },
    columns: { type: Array, required: true },
    loading:{type:boolean,required:false},
    selectable:{type:boolean,required:false},
    emptyText:{type:String,required:false}
},
methods: {
    tableTdData(item, column) {
        const val = item[column.field];
        if (column.type === 'date') {
            const d = new Date(val);
            return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
        }
        if (!val) {
val=this.emptyText ? this.emptyText : '-';
    }
    return val;
}}

</script>

<template>
 <div v-if="data.length > 0" class="datatable">
    <table>
        <thead>
            <tr>
                <th v-for="(column, index) in columns" :key="index">
                    {{ column.label }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in data" :key="index">
                <td v-for="(column, colIndex) in columns" :key="colIndex">
                    <template v-if="column.type === 'template'">
                        <slot :name="column.slot" :item="item"></slot>
                    </template>
                    <template v-else>
                        {{ tableTdData(item, column) }}
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
</div>
<div v-else class="errorBlock">אין נתונים להצגה</div>

</template>
