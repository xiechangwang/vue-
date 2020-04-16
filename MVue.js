class Compile{
	constructor(el,vm){
		this.el=this.isElementNode(el)?el:document.querySelector(el);
	}
}

class MVue{
	constructor(options) {
	    this.$el= options.el;
		this.$data=options.data;
		this.$options=options;
		if(this.$el){
			//1、实现一个数据的观察者obServer
			//2、实现一个指令解析器
			new Compile(this.$el,this);
		}
	}
}