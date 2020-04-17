const compileUtil={
	getVal(expr,vm){
		return expr.split('.').reduce((data,currentVal)=>{
			// console.log(data[currentVal])
			return data[currentVal];
		},vm.$data)
	},
	text(node,expr,vm){	//v-text {{}}
		//处理{{}}
		let value;
		if(expr.indexOf('{{')!==-1){
			value=expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
				console.log(args)
				return this.getVal(args[1],vm);
			})
		}else{
			//获取data里面expr对应数据
			value=this.getVal(expr,vm);
		}
		this.updater.textUpdater(node,value);
	},
	html(node,expr,vm){
		//获取data里面expr对应数据
		const value=this.getVal(expr,vm);
		this.updater.htmlUpdater(node,value);
	},
	model(node,expr,vm){
		//获取data里面expr对应数据
		const value=this.getVal(expr,vm);
		this.updater.modelUpdater(node,value);
	},
	on(node,expr,vm,eventName){
		
	},
	//更新的函数
	updater:{
		//更新文本
		textUpdater(node,value){
			//textContent文本赋值方法
			node.textContent=value;
		},
		//更新html
		htmlUpdater(node,value){
			node.innerHTML=value;
		},
		//更新表单model
		modelUpdater(node,value){
			node.value=value;
		}		
	}	
}

class Compile{
	constructor(el,vm){
		this.el=this.isElementNode(el)?el:document.querySelector(el);
		// console.log(this.el);
		this.vm=vm;
		//1、获取文档碎片对象，放入内存中会减少页面的回流和重绘
		const fragment=this.node2Fragment(this.el);
		// console.log(fragment);
		//2、编译模板
		this.compile(fragment);
		//3、追加子元素到根元素；
		this.el.appendChild(fragment);
	}
	compile(fragment){
		//1、获取到所有的子节点
		const childNodes=fragment.childNodes;
		[...childNodes].forEach(child=>{
			//所有的子节点
			// console.log(child)
			if(this.isElementNode(child)){
				//是元素节点
				//编译元素节点
				// console.log('元素',child);
				this.compileElement(child);
			}else{
				//元素节点	
				// console.log('文本');
				this.compileText(child);
			}
			//子元素遍历
			if(child.childNodes && child.childNodes.length){
				this.compile(child);
			}
		})
	}
	//编译元素
	compileElement(node){
		//获取每个元素身上的每一个属性
		const attributes=node.attributes;
		[...attributes].forEach(attr=>{
			//结构赋值
			const {name,value}=attr;
			if(this.isDirective(name)){
				//text、html、model
				const [,dirctive]=name.split('-');
				const [dirName,eventName]=dirctive.split(':');	//处理v-on:
				// console.log(dirName);
				//声明一个类-----数据驱动视图
				compileUtil[dirName](node,value,this.vm,eventName)
				
				//删除v-等有指令标签的属性
				node.removeAttribute('v-'+dirctive);
			}
		})
		// console.log(attributes);
	}
	//编译文本
	compileText(node){
		//编译文本{{}}
		const content=node.textContent;
			if(/\{\{(.+?)\}\}/.test(content)){
				// console.log(content);
				//调用更新视图类
				//当前为文本类型text
				compileUtil['text'](node,content,this.vm);
			}	
	}
	isDirective(attrName){
		return attrName.startsWith('v-');	//判断是否包含指定字符；是为true，否则为false
	}	
	node2Fragment(el){
		//创建文档碎片对象
		const f=document.createDocumentFragment();
		let firstChild;
		while(firstChild = el.firstChild){
			f.appendChild(firstChild)
		}
		return f;
	}
	//判断是文本还是元素
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