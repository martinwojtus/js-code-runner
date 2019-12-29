(function(){function resourcesTabTmpl(it
/*``*/) {
var out='<div> ';if(it.jsList.length !== 0){out+=' <h3><i class="fab fa-js-square"></i> JS</h3> <ul class="jcr-list-group"> ';var arr1=it.jsList;if(arr1){var js,jsIndex=-1,l1=arr1.length-1;while(jsIndex<l1){js=arr1[jsIndex+=1];out+=' <li class="jcr-list-group-item"> <a href="'+(js)+'" target="_blank">'+(js)+'</a> </li> ';} } out+=' </ul> ';}out+=' ';if(it.cssList.length !== 0){out+=' <h3><i class="fas fa-file-code"></i> CSS</h3> <ul class="jcr-list-group"> ';var arr2=it.cssList;if(arr2){var css,cssIndex=-1,l2=arr2.length-1;while(cssIndex<l2){css=arr2[cssIndex+=1];out+=' <li class="jcr-list-group-item"> <a href="'+(css)+'" target="_blank">'+(css)+'</a> </li> ';} } out+=' </ul> ';}out+='</div>';return out;
}var itself=resourcesTabTmpl, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['resourcesTabTmpl']=itself;}}());