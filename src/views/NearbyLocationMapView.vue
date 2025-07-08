<template>
  <div class="nearby-map-view">
    <Navbar />
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h1 class="text-2xl font-bold text-blue-700 mb-2">附近地点地图</h1>
        <p class="text-gray-600 mb-6">查看特定位置附近的动态地图</p>
        
        <!-- 搜索和控制区域 -->
        <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="col-span-1">
            <label class="block text-sm font-medium mb-1">位置名称</label>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="输入位置名称..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div class="col-span-1">
            <label class="block text-sm font-medium mb-1">缩放级别</label>
            <div class="flex items-center">
              <input 
                :value="zoom" 
                @input="updateZoom($event.target.value)" 
                type="range" 
                min="3" 
                max="19" 
                class="w-full mr-2"
              />
              <span class="text-sm font-medium">{{ zoom }}</span>
            </div>
          </div>
          
          <div class="col-span-1 flex items-end">
            <button 
              @click="searchLocation" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              搜索位置
            </button>
          </div>
        </div>
        
        <!-- 坐标信息 -->
        <div class="mb-4 flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
          <div>
            <span class="font-medium">当前位置:</span> {{ locationName || '未指定' }}
          </div>
          <div>
            <span class="font-medium">经度:</span> {{ position.longitude }}
          </div>
          <div>
            <span class="font-medium">纬度:</span> {{ position.latitude }}
          </div>
        </div>
        
        <!-- 地图区域 -->
        <div class="map-container">
          <LocationMap 
            ref="mapRef"
            :position="position"
            :locationName="locationName"
            :zoom="zoom"
            :showInfo="false"
            @map-loaded="onMapLoaded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import LocationMap from '@/components/map/LocationMap.vue'
import { apiRequest } from '@/lib/api/apiClient'

// 地图状态
const position = ref({ longitude: 104.06, latitude: 30.67 }) // 默认位置：成都
const locationName = ref('成都市')
const zoom = ref(Number(15)) // 确保是数字类型
const mapRef = ref(null)
const mapInstance = ref(null)

// 搜索状态
const searchQuery = ref('')
const loading = ref(false)

// 确保 zoom 始终是数字类型
const updateZoom = (val) => {
  zoom.value = Number(val)
}

// 地图加载完成回调
const onMapLoaded = (instance) => {
  mapInstance.value = instance
  console.log('地图加载完成')
  
  // 如果有mapRef且位置有更新，可以调整地图视角
  if (mapRef.value && mapInstance.value) {
    const mapObj = mapRef.value.getMapInstance()
    if (mapObj) {
      mapObj.setZoom(zoom.value)
      mapObj.setCenter([position.value.longitude, position.value.latitude])
    }
  }
}

// 搜索位置
const searchLocation = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  try {
    // 调用位置搜索API
    const response = await apiRequest(`/v1/map/search?keyword=${encodeURIComponent(searchQuery.value)}`)
    
    if (response.data) {
      const location = response.data
      
      // 更新位置和名称
      position.value = {
        longitude: location.longitude || location.lon || location.lng,
        latitude: location.latitude || location.lat
      }
      locationName.value = location.name || location.title || searchQuery.value
      
      console.log('位置已更新:', position.value)
      
      // 重新初始化地图组件
      if (mapRef.value && mapRef.value.getMapInstance) {
        // 销毁旧的地图实例
        const oldMap = mapRef.value.getMapInstance()
        if (oldMap && oldMap.destroy) {
          oldMap.destroy()
        }
        
        // 重新初始化地图
        if (mapRef.value.resize) {
          setTimeout(() => {
            mapRef.value.resize()
          }, 300)
        }
        
        // 获取新的动态地图
        const mapObj = mapRef.value.getMapInstance()
        if (mapObj) {
          mapObj.setZoom(zoom.value)
          mapObj.setCenter([position.value.longitude, position.value.latitude])
        }
      }
    } else {
      console.error('搜索位置失败:', response.data.message)
      alert('搜索位置失败，请重试')
    }
  } catch (error) {
    console.error('搜索位置出错:', error)
    alert('搜索位置出错，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.map-container {
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .map-container {
    height: 400px;
  }
}
</style> 