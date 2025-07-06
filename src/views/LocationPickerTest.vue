<template>
  <div class="location-picker-test">
    <Navbar />
    
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h1 class="text-2xl font-bold text-blue-700 mb-4">地址选择器测试页面</h1>
        <p class="text-gray-600 mb-8">请输入关键词搜索地点，或使用当前位置</p>
        
        <div class="map-wrapper">
          <MapLocationPicker 
            :initialPosition="initialPosition" 
            @location-selected="handleLocationSelected"
            @location-change="handleLocationChange"
            @search-results="handleSearchResults"
            ref="mapPicker"
          />
        </div>
        
        <div v-if="selectedLocation" class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 class="text-lg font-semibold text-blue-800 mb-2">已选择位置信息</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="mb-1"><span class="font-medium">完整地址：</span>{{ selectedLocation.address.formatted_address }}</p>
              <p class="mb-1"><span class="font-medium">省份：</span>{{ selectedLocation.address.addressComponent.province }}</p>
              <p class="mb-1"><span class="font-medium">城市：</span>{{ selectedLocation.address.addressComponent.city }}</p>
              <p class="mb-1"><span class="font-medium">区县：</span>{{ selectedLocation.address.addressComponent.district }}</p>
              <p v-if="selectedLocation.address.addressComponent.streetNumber" class="mb-1">
                <span class="font-medium">街道：</span>
                {{ selectedLocation.address.addressComponent.street }}
                {{ selectedLocation.address.addressComponent.streetNumber }}
              </p>
            </div>
            <div>
              <p class="mb-1"><span class="font-medium">经度：</span>{{ selectedLocation.position.longitude }}</p>
              <p class="mb-1"><span class="font-medium">纬度：</span>{{ selectedLocation.position.latitude }}</p>
              <p class="mb-1"><span class="font-medium">行政区划代码：</span>{{ selectedLocation.address.addressComponent.adcode }}</p>
            </div>
          </div>
          
          <div class="mt-4 flex justify-end">
            <button 
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              @click="saveLocation"
            >
              使用此位置
            </button>
          </div>
        </div>
        
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">预设搜索</h2>
          <div class="flex flex-wrap gap-2">
            <button 
              @click="searchKeyword('成都国家信息中心')"
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              成都国家信息中心
            </button>
            <button 
              @click="searchKeyword('北京王府井')"
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              北京王府井
            </button>
            <button 
              @click="searchKeyword('上海外滩')"
              class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              上海外滩
            </button>
            <button 
              @click="getCurrentLocation"
              class="px-3 py-1 bg-blue-200 text-blue-700 rounded hover:bg-blue-300"
            >
              获取我的位置
            </button>
          </div>
        </div>
        
        <div class="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="font-semibold mb-2">操作日志：</h3>
          <div class="max-h-60 overflow-y-auto text-sm font-mono bg-gray-100 p-2 rounded">
            <div v-for="(log, index) in logs" :key="index" class="mb-1">
              {{ log }}
            </div>
            <div v-if="logs.length === 0" class="text-gray-400">
              暂无操作记录
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import MapLocationPicker from '@/components/map/MapLocationPicker.vue'

const mapPicker = ref(null)
const selectedLocation = ref(null)
const logs = ref([])
const searchResultCount = ref(0)

// 初始位置 (成都天府广场)
const initialPosition = {
  longitude: 104.066801,
  latitude: 30.657378
}

// 用户确认选择位置
const handleLocationSelected = (locationData) => {
  selectedLocation.value = locationData
  addLog(`✅ 确认选择: ${locationData.address.formatted_address}`)
}

// 位置变更
const handleLocationChange = (locationData) => {
  if (locationData && locationData.position && locationData.address) {
    addLog(`📍 位置变更: ${locationData.position.longitude.toFixed(6)}, ${locationData.position.latitude.toFixed(6)}`)
  }
}

// 处理搜索结果
const handleSearchResults = (results) => {
  searchResultCount.value = results.length
  addLog(`🔍 搜索结果: 找到 ${results.length} 个位置`)
  
  // 记录每个搜索结果
  results.forEach((result, index) => {
    addLog(`  ${index + 1}. ${result.name} (${result.address})`)
  })
}

// 添加日志
const addLog = (message) => {
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  logs.value.unshift(`[${timeStr}] ${message}`)
}

// 搜索关键词
const searchKeyword = (keyword) => {
  if (mapPicker.value) {
    addLog(`🔎 搜索: ${keyword}`)
    mapPicker.value.search(keyword)
  }
}

// 获取当前位置
const getCurrentLocation = () => {
  if (mapPicker.value) {
    addLog('📱 获取当前位置...')
    mapPicker.value.getUserLocation()
  }
}

// 保存位置
const saveLocation = () => {
  if (selectedLocation.value) {
    addLog(`💾 保存位置: ${selectedLocation.value.address.formatted_address}`)
    alert(`位置已保存: ${selectedLocation.value.address.formatted_address}`)
    // 在实际应用中，这里可以将位置保存到表单或数据库
  }
}
</script>

<style scoped>
.map-wrapper {
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
