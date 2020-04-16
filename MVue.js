class Compile{
	constructor(el,vm){
		this.el=this.isElementNode(el)?el:document.querySelector(el);
		// console.log(this.el);
		this.vm=vm;
		//1、获取文档碎片对象，放入内存中会减少页面的回流和重绘
		const fragment=this.node2Fragment(this.el);
	}
	node2Fragment(el){
		//创建文档碎片对象
		const f=document.createDocumentFragment();
		let firstChild;
		while(firstChild = el.firstChild){
			f.appendChild(firstChild)
		}	
	}
	isElementNode(node){
		return node.nodeType===1;
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