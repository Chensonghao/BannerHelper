;(function() {
	'use strict'
	/*
  @param {Object} [options={}]
  */
	function BannerHelper(opts) {
		if (!opts) return
		var container = document.querySelector(opts.el)
		if (!container) return
		this.container = container
		this.init(opts)
	}
	BannerHelper.prototype = {
		init: function(opts) {
			var container = this.container
			this.currentPageIndex = 0
			this.bannerLen = container.querySelectorAll('img').length
			container.style.width = this.bannerLen * 100 + '%'
			this.imgWidth = container.clientWidth / this.bannerLen
			this.callback = opts.callback
			this.interval = opts.interval
			opts.autoPlay && this.play()

			var startX = 0
			var startY = 0
			var offsetX = 0
			var noBubble = false
			var noSlide = false
			var _this = this
			container.addEventListener('touchstart', function(e) {
				e.preventDefault()
				startX = e.targetTouches[0].pageX
				startY = e.targetTouches[0].pageY
				_this.stop()
				noBubble = false
				noSlide = false
			})
			container.addEventListener('touchmove', function(e) {
				e.preventDefault()
				offsetX = e.targetTouches[0].pageX - startX
				var offsetY = e.targetTouches[0].pageY - startY
				if (!noBubble && !noSlide) {
					if (Math.abs(offsetX) >= Math.abs(offsetY)) {
						noBubble = true
					} else {
						noSlide = true
					}
				}
				noBubble && e.stopPropagation()
				if (noSlide) return
				var x = offsetX - _this.currentPageIndex * _this.imgWidth
				if (x > 0) {
					x = 0
				}
				if (x < -_this.imgWidth * (_this.bannerLen - 1)) {
					x = -_this.imgWidth * (_this.bannerLen - 1)
				}
				container.style.transition = 'transform 0s'
				container.style.transform = 'translate3d(' + x + 'px,0,0)'
			})
			container.addEventListener('touchend', function(e) {
				e.preventDefault()
				if (noSlide) return
				noBubble && e.stopPropagation()
				if (Math.abs(offsetX) > _this.imgWidth * (opts.percent || 0.3)) {
					_this.animation(true, offsetX > 0)
				} else {
					_this.animation(true, offsetX > 0, true)
				}
				_this.play()
			})
			window.addEventListener('resize', function() {
				_this.imgWidth = container.clientWidth / _this.bannerLen
			})
		},
		play: function() {
			this.stop()
			this.timer = setInterval(this.animation.bind(this), this.interval)
		},
		stop: function() {
			clearInterval(this.timer)
		},
		animation: function(isDrap, isReverse, isRestore) {
			var container = this.container
			container.style.transition = 'transform 0.5s ease-out'
			if (!isRestore) {
				if (isDrap) {
					if (
						(this.currentPageIndex === 0 && isReverse) ||
						(!isReverse && this.currentPageIndex === this.bannerLen - 1)
					) {
						return
					}
					isReverse ? this.currentPageIndex-- : this.currentPageIndex++
				} else if (this.currentPageIndex === this.bannerLen - 1) {
					container.style.transition = 'transform 0s'
					this.currentPageIndex = 0
				} else {
					this.currentPageIndex++
				}
			}
			var x = this.currentPageIndex * this.imgWidth
			container.style.transform = 'translate3d(-' + x + 'px,0,0)'
			this.callback && this.callback(this.currentPageIndex)
		}
	}
	BannerHelper.attach = function(opts) {
		return new BannerHelper(opts)
	}
	if (
		typeof define === 'function' &&
		typeof define.amd === 'object' &&
		define.amd
	) {
		define(function() {
			return BannerHelper
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = BannerHelper.attach
		module.exports.BannerHelper = BannerHelper
	} else {
		window.BannerHelper = BannerHelper
	}
})()
