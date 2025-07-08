<template>
  <div class="location-map">
    <div class="map-container" ref="mapContainer" :id="mapId"></div>
    
    <div class="loading-overlay" v-if="loading">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>
    
    <div class="location-info" v-if="showInfo">
      <h3 class="text-lg font-medium">{{ locationName || '位置信息' }}</h3>
      <p class="text-sm text-gray-600">经度: {{ position.longitude }}, 纬度: {{ position.latitude }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  // 位置坐标 (经度,纬度)
  position: {
    type: Object,
    default: () => ({ longitude: 104.06, latitude: 30.67 }), // 默认成都中心
    validator: (val) => {
      // 验证经纬度是否为数值类型
      return typeof val.longitude === 'number' && typeof val.latitude === 'number'
    }
  },
  // 地点名称 (可选)
  locationName: {
    type: String,
    default: ''
  },
  // 缩放级别
  zoom: {
    type: Number,
    default: 15,
    validator: (val) => {
      // 确保zoom是数字，如果不是，尝试转换
      if (typeof val !== 'number') {
        console.warn('Zoom prop should be a number, got', typeof val)
        return false
      }
      return val >= 1 && val <= 20
    }
  },
  // 地图容器ID
  mapId: {
    type: String,
    default: 'locationMap'
  },
  // 地图高度
  height: {
    type: String,
    default: '500px'
  },
  // 地图宽度
  width: {
    type: String,
    default: '100%'
  },
  // 是否显示位置信息
  showInfo: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['map-loaded'])
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const loading = ref(false)
const loadingMessage = ref('加载地图中...')

// 从后端获取位置信息
const fetchLocationFromBackend = async () => {
  try {
    // 调用后端API获取位置信息
    const locationResponse = await axios.get('/api/v1/map/location')
    
    if (locationResponse.data.code === 200 && locationResponse.data.data) {
      const data = locationResponse.data.data
      
      // 检查返回数据是否包含有效的经纬度
      if (data.latitude && data.longitude && 
          !isNaN(Number(data.latitude)) && !isNaN(Number(data.longitude))) {
        
        // 更新位置
        currentPosition = {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude)
        }
        
        // 如果提供了名称，也更新名称
        if (data.name) {
          currentLocationName = data.name
        }
        
        console.log('从后端获取位置成功:', currentPosition)
        return currentPosition
      }
    }
    
    // 如果没有有效数据，返回null
    return null
  } catch (error) {
    console.warn('从后端获取位置失败:', error)
    return null
  }
}

// 初始化地图
const initMap = async () => {
  loading.value = true
  
  // 声明当前位置和位置名称变量
  let currentPosition = { ...props.position }
  let currentLocationName = props.locationName
  
  // 尝试从后端获取位置
  const backendPosition = await fetchLocationFromBackend()
  if (backendPosition) {
    currentPosition = backendPosition
  }
  
  try {
    // 默认使用本地脚本地址，因为后端API可能尚未实现
    let scriptUrl = 'https://webapi.amap.com/maps?v=2.0&key=6ac0fa4484bd83396be5cf7440a806c3'
    
    try {
      // 尝试获取JS脚本URL配置
      const configResponse = await axios.get('/api/v1/map/config')
      
      if (configResponse.data.code === 200 && configResponse.data.data?.jsUrl) {
        scriptUrl = configResponse.data.data.jsUrl
      }
    } catch (e) {
      console.warn('获取地图配置失败，使用默认配置', e)
    }
    
    // 加载地图脚本
    await loadMapScript(scriptUrl)
    
    // 检查AMap是否存在
    if (!window.AMap) {
      throw new Error('地图加载失败')
    }
    
    // 准备动态地图请求参数
    const mapParams = {
      center: `${currentPosition.longitude},${currentPosition.latitude}`,
      zoom: props.zoom
    }
    
    // 添加标记
    if (currentLocationName) {
      mapParams.markers = `${currentPosition.longitude},${currentPosition.latitude},${currentLocationName},${currentLocationName}`
    }
    
    // 默认地图配置
    let mapConfig = {
      zoom: props.zoom,
      center: `${currentPosition.longitude},${currentPosition.latitude}`,
      plugins: ['AMap.ToolBar', 'AMap.Scale'],
      markers: currentLocationName ? [{
        position: [currentPosition.longitude, currentPosition.latitude],
        title: currentLocationName,
        content: currentLocationName
      }] : []
    }
    
    try {
      // 尝试获取动态地图配置
      const dynamicMapResponse = await axios.get('/api/v1/map/dynamicmap', {
        params: mapParams
      })
      
      if (dynamicMapResponse.data.code === 200 && dynamicMapResponse.data.data) {
        mapConfig = dynamicMapResponse.data.data
      }
    } catch (e) {
      console.warn('获取动态地图配置失败，使用默认配置', e)
    }
    
    // 创建地图实例
    map.value = new window.AMap.Map(props.mapId, {
      zoom: mapConfig.zoom || props.zoom,
      center: mapConfig.center ? mapConfig.center.split(',').map(Number) : [currentPosition.longitude, currentPosition.latitude],
      resizeEnable: true,
      viewMode: mapConfig.viewMode || '2D'
    })
    
    // 添加基础控件
    if (mapConfig.plugins && Array.isArray(mapConfig.plugins)) {
      map.value.plugin(mapConfig.plugins, () => {
        if (mapConfig.plugins.includes('AMap.ToolBar')) {
          map.value.addControl(new window.AMap.ToolBar())
        }
        if (mapConfig.plugins.includes('AMap.Scale')) {
          map.value.addControl(new window.AMap.Scale())
        }
        if (mapConfig.plugins.includes('AMap.HawkEye')) {
          map.value.addControl(new window.AMap.HawkEye())
        }
      })
    }
    
    // 添加标记点
    if (mapConfig.markers && Array.isArray(mapConfig.markers)) {
      mapConfig.markers.forEach(markerConfig => {
        const markerInstance = new window.AMap.Marker({
          position: markerConfig.position,
          title: markerConfig.title,
          icon: markerConfig.icon,
          map: map.value
        })
        
        // 如果有内容，添加信息窗体
        if (markerConfig.content) {
          const infoWindow = new window.AMap.InfoWindow({
            content: markerConfig.content,
            offset: markerConfig.label?.offset 
              ? new window.AMap.Pixel(markerConfig.label.offset[0], markerConfig.label.offset[1]) 
              : new window.AMap.Pixel(0, -30)
          })
          
          // 自动打开第一个标记的信息窗口
          if (mapConfig.markers.indexOf(markerConfig) === 0) {
            infoWindow.open(map.value, markerInstance.getPosition())
          }
          
          // 点击标记时显示信息窗体
          markerInstance.on('click', () => {
            infoWindow.open(map.value, markerInstance.getPosition())
          })
        }
      })
      
      // 保存第一个标记为组件的marker
      if (mapConfig.markers.length > 0) {
        marker.value = mapConfig.markers[0]
      }
    } else {
      // 如果后端没有提供标记，创建默认标记
      marker.value = new window.AMap.Marker({
        position: [currentPosition.longitude, currentPosition.latitude],
        title: currentLocationName || '当前位置',
        map: map.value
      })
      
      // 如果提供了位置名称，则添加信息窗体
      if (currentLocationName) {
        const infoWindow = new window.AMap.InfoWindow({
          content: `<div style="padding: 8px 0">${currentLocationName}</div>`,
          offset: new window.AMap.Pixel(0, -30)
        })
        
        // 地图加载完成后打开信息窗体
        infoWindow.open(map.value, marker.value.getPosition())
      }
    }
    
    // 通知父组件地图加载完成
    emit('map-loaded', map.value)
    
  } catch (error) {
    console.error('地图初始化失败', error)
    // 尝试使用备用方式初始化基础地图
    try {
      if (window.AMap) {
        // 创建基础地图实例
        map.value = new window.AMap.Map(props.mapId, {
          zoom: props.zoom,
          center: [currentPosition.longitude, currentPosition.latitude],
          resizeEnable: true
        })
        
        // 添加基础控件
        map.value.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
          map.value.addControl(new window.AMap.ToolBar())
          map.value.addControl(new window.AMap.Scale())
        })
        
        // 添加标记
        marker.value = new window.AMap.Marker({
          position: [currentPosition.longitude, currentPosition.latitude],
          title: currentLocationName || '当前位置',
          map: map.value
        })
        
        // 通知父组件地图加载完成
        emit('map-loaded', map.value)
      }
    } catch (fallbackError) {
      console.error('备用地图初始化也失败', fallbackError)
    }
  } finally {
    loading.value = false
  }
}

// 动态加载地图脚本
const loadMapScript = (scriptUrl) => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = scriptUrl
    script.onload = () => {
      setTimeout(resolve, 300)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 设置地图尺寸
const setMapSize = () => {
  if (mapContainer.value) {
    mapContainer.value.style.height = props.height
    mapContainer.value.style.width = props.width
  }
}

// 组件挂载时初始化
onMounted(() => {
  setMapSize()
  initMap()
})

// 组件卸载时清理资源
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
  // 刷新地图大小
  resize: () => {
    if (map.value) {
      map.value.resize()
    }
  },
  
  // 获取地图实例
  getMapInstance: () => map.value
})
</script>

<style scoped>
.location-map {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.map-container {
  width: 100%;
  height: 400px;
}

.location-info {
  padding: 12px 16px;
  background-color: white;
  border-top: 1px solid #eaeaea;
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
  z-index: 10;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 