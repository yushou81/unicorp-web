import type { Directive, DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  _clickOutsideHandler?: (event: Event) => void
}

/**
 * 点击外部指令
 * 用于检测点击元素外部的事件
 * 
 * 使用方法:
 * v-click-outside="handleClickOutside"
 */
export const clickOutside: Directive = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
    el._clickOutsideHandler = (event: Event) => {
      // 如果点击的元素不是当前元素或其子元素，则触发绑定的函数
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    
    // 添加全局点击事件监听器
    document.addEventListener('click', el._clickOutsideHandler)
  },
  
  beforeUnmount(el: ClickOutsideElement) {
    // 移除全局点击事件监听器
    if (el._clickOutsideHandler) {
      document.removeEventListener('click', el._clickOutsideHandler)
      delete el._clickOutsideHandler
    }
  }
}

export default clickOutside 