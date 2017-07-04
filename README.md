# BannerHelper
### use
```javascript
  npm install --save bannerhelper
```
```javascript
  import bannerHelper from 'bannerhelper';
  bannerHelper.attach({
    el: '#id',
    autoPlay: true,
    interval: 3000,
    percent: 0.3,
    callback: function(index) {
      //每次切换索引后回调
      //--todo
    }
  });
```
