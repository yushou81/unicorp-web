<template>
  <div class="map-location-picker">
    <div class="search-container">
      <input 
        v-model="searchKeyword" 
        type="text" 
        placeholder="搜索地点" 
        class="search-input" 
        @keyup.enter="handleSearch"
      />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </div>
    
    <!-- 搜索结果列表 -->
    <div v-if="searchResults.length > 0" class="search-results">
      <div class="search-result-header">
        <h4>搜索结果 ({{ searchResults.length }})</h4>
        <button class="close-btn" @click="clearSearchResults">×</button>
      </div>
      <div class="search-result-list">
        <div
          v-for="(item, index) in searchResults" 
          :key="item.id"
          class="search-result-item"
          :class="{ 'active': selectedSearchIndex === index }"
          @click="selectSearchResult(item, index)"
        >
          <div class="result-name">{{ item.name }}</div>
          <div class="result-address">{{ item.address }}</div>
          <div class="result-district">{{ item.pname }} {{ item.cityname }} {{ item.adname }}</div>
        </div>
      </div>
    </div>
    
    <div class="map-container" ref="mapContainer"></div>
    
    <div class="location-btn" @click="getUserLocation">
      <div class="location-icon"></div>
    </div>
    
    <div class="loading-overlay" v-if="loading">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { apiRequest } from '@/lib/api/apiClient'

const props = defineProps({
  initialPosition: {
    type: Object,
    default: () => ({ longitude: 112.929103, latitude: 28.169799 })
  },
  zoom: {
    type: Number,
    default: 16
  }
})

const emit = defineEmits(['location-selected', 'location-change', 'search-results'])

const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const currentPosition = ref({ longitude: props.initialPosition.longitude, latitude: props.initialPosition.latitude })
const currentAddress = ref(null)
const loading = ref(false)
const loadingMessage = ref('获取地址信息中...')
const mapInitialized = ref(false)

// 搜索相关
const searchKeyword = ref('')
const searchResults = ref([])
const selectedSearchIndex = ref(-1)

// 初始化地图
const initMap = async () => {
  loading.value = true
  loadingMessage.value = '正在加载地图...'
  
  try {
    // 默认使用本地脚本地址，因为后端API可能尚未实现
    let jsUrl = 'https://webapi.amap.com/maps?v=2.0&key=6ac0fa4484bd83396be5cf7440a806c3'
    
    try {
      // 尝试获取JS脚本URL配置
      const response = await apiRequest('/v1/map/config')
      
      if (response.data?.jsUrl) {
        jsUrl = response.data.jsUrl
      }
    } catch (e) {
      console.warn('获取地图配置失败，使用默认配置', e)
    }
    
    // 动态加载地图JS
    await loadMapScript(jsUrl)
    
    // 检查AMap是否存在
    if (!window.AMap) {
      throw new Error('地图加载失败')
    }
    
    console.log('AMap加载成功，版本:', window.AMap.version);
    
    // 创建地图实例
    map.value = new window.AMap.Map(mapContainer.value, {
      zoom: props.zoom,
      center: [currentPosition.value.longitude, currentPosition.value.latitude],
      resizeEnable: true
    })
    
    // 添加标记 - 使用基本标记
    marker.value = new window.AMap.Marker({
      position: [currentPosition.value.longitude, currentPosition.value.latitude],
      draggable: true,
      cursor: 'move',
      title: '拖动我设置位置',
      map: map.value
    })
    
    // 添加标记拖拽事件监听
    marker.value.on('dragend', handleMarkerDragEnd)
    
    // 添加地图点击事件
    map.value.on('click', handleMapClick)
    
    // 初始获取地址信息
    await fetchAddressFromCoordinates(currentPosition.value.longitude, currentPosition.value.latitude)
    
    // 标记地图初始化完成
    mapInitialized.value = true
    
  } catch (error) {
    console.error('地图初始化失败', error)
    alert('地图加载失败，请稍后再试: ' + error.message)
    mapInitialized.value = false
  } finally {
    loading.value = false
  }
}

// 获取用户当前位置
const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert('您的浏览器不支持地理定位功能')
    return
  }
  
  loading.value = true
  loadingMessage.value = '正在获取您的位置...'
  
  navigator.geolocation.getCurrentPosition(
    // 成功获取位置
    async (position) => {
      const { longitude, latitude } = position.coords
      console.log(`获取到用户位置: ${longitude}, ${latitude}`)
      
      currentPosition.value = { longitude, latitude }
      
      if (map.value && marker.value && mapInitialized.value) {
        map.value.setCenter([longitude, latitude])
        marker.value.setPosition([longitude, latitude])
        
        // 获取详细地址
        await fetchAddressFromCoordinates(longitude, latitude)
      }
      
      loading.value = false
    },
    // 获取位置失败
    (error) => {
      console.error('获取用户位置失败:', error)
      let errorMsg = '无法获取您的位置'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = '您拒绝了位置请求权限'
          break
        case error.POSITION_UNAVAILABLE:
          errorMsg = '位置信息不可用'
          break
        case error.TIMEOUT:
          errorMsg = '获取位置请求超时，将使用默认位置'
          // 使用默认位置
          fetchAddressFromCoordinates(currentPosition.value.longitude, currentPosition.value.latitude)
          break
      }
      
      alert(errorMsg)
      loading.value = false
    },
    // 选项
    {
      enableHighAccuracy: false,  // 降低精度要求，提高响应速度
      timeout: 30000,             // 增加超时时间到30秒
      maximumAge: 300000          // 允许使用5分钟内缓存的位置
    }
  )
}

// 动态加载地图脚本
const loadMapScript = (jsUrl) => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = jsUrl
    script.onload = () => {
      console.log('地图脚本加载完成')
      // 增加延迟确保API完全初始化
      setTimeout(resolve, 500)
    }
    script.onerror = (e) => {
      console.error('地图脚本加载失败:', e)
      reject(new Error('地图脚本加载失败'))
    }
    document.head.appendChild(script)
  })
}

// 处理标记拖拽结束事件
const handleMarkerDragEnd = (e) => {
  if (!mapInitialized.value) return
  
  const { lng: longitude, lat: latitude } = e.target.getPosition()
  
  currentPosition.value = { longitude, latitude }
  fetchAddressFromCoordinates(longitude, latitude)
}

// 处理地图点击事件
const handleMapClick = (e) => {
  if (!mapInitialized.value || !marker.value) return
  
  const { lng: longitude, lat: latitude } = e.lnglat
  
  currentPosition.value = { longitude, latitude }
  marker.value.setPosition([longitude, latitude])
  
  fetchAddressFromCoordinates(longitude, latitude)
}

// 搜索地点
const handleSearch = async () => {
  if (!searchKeyword.value.trim() || !mapInitialized.value) {
    return
  }
  
  loading.value = true
  loadingMessage.value = '搜索中...'
  
  try {
    const response = await apiRequest(`/v1/map/search?keyword=${encodeURIComponent(searchKeyword.value)}&city=全国`)
    
    if (response.data && 
        response.data.pois && 
        response.data.pois.length > 0) {
      
      searchResults.value = response.data.pois
      emit('search-results', searchResults.value)
      
      console.log(`找到 ${searchResults.value.length} 个地点`)
      
      // 不再自动选择第一个结果
      // selectedSearchIndex.value = 0
      // selectSearchResult(searchResults.value[0], 0)
    } else {
      searchResults.value = []
      alert('未找到相关位置')
    }
  } catch (error) {
    console.error('搜索位置失败', error)
    alert('搜索失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 选择搜索结果
const selectSearchResult = (item, index) => {
  if (!item || !item.location) return
  
  selectedSearchIndex.value = index
  
  // 提取位置坐标
  const locationParts = item.location.split(',')
  if (locationParts.length !== 2) {
    console.error('位置格式错误:', item.location)
    return
  }
  
  const longitude = parseFloat(locationParts[0])
  const latitude = parseFloat(locationParts[1])
  
  // 更新当前位置
  currentPosition.value = { longitude, latitude }
  
  // 更新地图和标记位置
  if (map.value && marker.value) {
    map.value.setCenter([longitude, latitude])
    marker.value.setPosition([longitude, latitude])
    
    // 获取详细地址
    fetchAddressFromCoordinates(longitude, latitude).then(() => {
      // 选择结果后自动确认位置并清除搜索结果
      if (currentAddress.value) {
        emit('location-selected', {
          position: currentPosition.value,
          address: currentAddress.value
        })
        clearSearchResults()
      }
    })
  }
}

// 清除搜索结果
const clearSearchResults = () => {
  searchResults.value = []
  selectedSearchIndex.value = -1
}

// 从后端获取地址信息
const fetchAddressFromCoordinates = async (longitude, latitude) => {
  if (!mapInitialized.value) return
  
  loading.value = true
  loadingMessage.value = '获取地址信息中...'
  
  try {
    const response = await apiRequest(`/v1/map/regeocode?lon=${longitude}&lat=${latitude}`)
    
    if (response.data && response.data.regeocode) {
      currentAddress.value = response.data.regeocode
      
      // 尝试自动调整到最近的POI点
      try {
        await adjustToNearestPOI(longitude, latitude)
      } catch (poiError) {
        console.warn('获取附近POI点失败', poiError)
      }
      
      // 发出位置变更事件
      emit('location-change', {
        position: currentPosition.value,
        address: currentAddress.value
      })

      // 自动确认位置选择
      emit('location-selected', {
        position: currentPosition.value,
        address: currentAddress.value
      })
    } else {
      console.error('获取地址信息失败：', response.data.message)
    }
  } catch (error) {
    console.error('获取地址信息出错：', error)
  } finally {
    loading.value = false
  }
}

// 调整到最近的POI点
const adjustToNearestPOI = async (longitude, latitude) => {
  if (!mapInitialized.value || !marker.value) return
  
  try {
    // 调用后端API获取附近POI点
    const response = await apiRequest(`/v1/map/nearby-poi?lon=${longitude}&lat=${latitude}&radius=100`)
    
    if (response.data && 
        response.data.pois && 
        response.data.pois.length > 0) {
      
      const nearestPOI = response.data.pois[0]
      if (!nearestPOI.location || !nearestPOI.distance) return
      
      const poiDistance = parseInt(nearestPOI.distance) || 0
      
      // 如果POI点与当前位置的距离小于30米，自动调整到POI点
      if (poiDistance < 30) {
        const locationParts = nearestPOI.location.split(',')
        
        if (locationParts.length === 2) {
          currentPosition.value = {
            longitude: parseFloat(locationParts[0]),
            latitude: parseFloat(locationParts[1])
          }
          
          if (marker.value) {
            marker.value.setPosition([currentPosition.value.longitude, currentPosition.value.latitude])
          }
          
          // 更新地址信息
          if (nearestPOI.name && currentAddress.value) {
            currentAddress.value.formatted_address = `${currentAddress.value.formatted_address} (${nearestPOI.name})`
          }
        }
      }
    }
  } catch (error) {
    console.warn('获取POI点错误:', error)
  }
}

// 组件挂载后初始化地图
onMounted(() => {
  initMap()
})

// 组件卸载前清理资源
onUnmounted(() => {
  if (map.value) {
    try {
      map.value.destroy()
    } catch (e) {
      console.warn('地图销毁失败:', e)
    }
  }
})

// 暴露方法给父组件调用
defineExpose({
  getCurrentLocation: () => ({
    position: currentPosition.value,
    address: currentAddress.value
  }),
  setLocation: (longitude, latitude) => {
    if (!mapInitialized.value || !map.value || !marker.value) {
      console.warn('地图未初始化，无法设置位置')
      return
    }
    
    currentPosition.value = { longitude, latitude }
    marker.value.setPosition([longitude, latitude])
    map.value.setCenter([longitude, latitude])
    fetchAddressFromCoordinates(longitude, latitude)
  },
  getUserLocation,
  search: (keyword) => {
    if (mapInitialized.value) {
      searchKeyword.value = keyword
      handleSearch()
    }
  },
  clearSearchResults
})
</script>

<style scoped>
.map-location-picker {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-container {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  gap: 8px;
}

.search-input {
  flex-grow: 1;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.search-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.search-results {
  position: absolute;
  top: 60px;
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 10;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-result-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-result-header h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.search-result-list {
  overflow-y: auto;
  max-height: 250px;
}

.search-result-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background-color: #f9fafb;
}

.search-result-item.active {
  background-color: #e5edff;
}

.result-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.result-address {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

.result-district {
  font-size: 12px;
  color: #999;
}

.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.location-btn {
  position: absolute;
  bottom: 100px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.location-icon {
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4" y1="12" x2="2" y2="12"/><line x1="22" y1="12" x2="20" y2="12"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

