(function(){function jsConsoleOutputRowTmplError(it
/*``*/) {
var out='<div class="jcr-content-row '+(it.className)+'"> <i class="fas fa-times-circle jcr-console-output-icon"></i> <div class="jcr-content-inner"> <pre>'+(it.content)+'</pre> </div></div>';return out;
}var itself=jsConsoleOutputRowTmplError, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['jsConsoleOutputRowTmplError']=itself;}}());