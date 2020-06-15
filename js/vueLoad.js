/**
 *
 * components:{
 *    Test: () => vueLoad('test.vue')
 * }
 *
 * test.vue 运行环境为 浏览器环境，不可以使用import xxx from 'xxx'
 *
 *
 */
function vueLoad(url, options = null) {
  if(!window) {
    return import(url)
  }


	return fetch(url, options)
		.then((res) => {
			return res.text()
		})
		.then((res) => {
			let template = res.match(/(?<=<template>)[\S\s]*(?=<\/template>)/g)
			template = template ? template[0].trim() : ''

			let optionsStr = res.match(/(?<=<script>)[\S\s]*(?=<\/script>)/g)

			optionsStr = !optionsStr ? '{}':
        optionsStr[0].trim().replace(/\s*export\s+default/, '') || '{}' 
        
			const options = new Function(` return ${optionsStr}`)()

			let style = res.match(/(?<=<style>)[\S\s]*(?=<\/style>)/g)

			style = style ? style[0].trim() : ''

			const styleDom = document.createElement('style')
			styleDom.innerHTML = style

			const addStyleMixin = {
				mounted() {
					this.$el.appendChild(styleDom)
				},
			}

			if (options.mixins) {
				options.mixins.push(addStyleMixin)
			} else {
				options.mixins = [addStyleMixin]
			}


			return { template, ...options }
    })
    
}
