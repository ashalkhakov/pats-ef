function tryparsing(code) {
    try {
        var obj = pparser.parse(code);
        return obj;
    }
    catch (e) { return e.message; }
}
      
function parseit() {
    var code = document.getElementById('source').value;
    console.log(code);

    var message = document.getElementById('message');

    var lines = code.split("\n");
    var lines_out = [];

    // message info
    var msginfo = "/tmp/patsopt_ccats_ZuFD70: 358(line=29, offs=5) -- 360(line=29, offs=7): error(3): the void pattern is ill-typed.";
    var re1 = /([^:]+): (\d+)\(line=(\d+), offs=(\d+)\) -- (\d+)\(line=(\d+), offs=(\d+)\): (error|warning)\((\d+)\): (.*)/;
    var arr = re1.exec(msginfo);
    // if arr is not null:
    // arr[1]: filepath
    // arr[2]: start offset
    // arr[3]: start line
    // arr[4]: start column
    // arr[5]: end offset
    // arr[6]: end line
    // arr[7]: end column
    // arr[8]: error/warning
    // arr[9]: level
    // arr[10]: message
    
    // The actual term is: ...
    var re2 = /(The actual term is:) (.*)/;
    // The needed term is: ...
    var re3 = /(The needed term is:) (.*)/;

    try {
        message.textContent = 'parsing...';

	for (
	    var ln = 0;
	    ln < lines.length;
	    ln++)
	{
	    var line = lines[ln];

	    var ere1 = re1.exec(line);
	    if (ere1) {
		var obj = {
		    filepath: ere1[1],
   		    beg_ofs: ere1[2],
		    beg_lin: ere1[3],
		    beg_col: ere1[4],
		    end_ofs: ere1[5],
		    end_lin: ere1[6],
		    end_col: ere1[7],
		    msgtype: ere1[8],
		    msglevel: ere1[9],
		    msgtext: ere1[10]
		};
		lines_out.push(obj);
		continue;
	    }
	    var ere2 = re2.exec(line);
	    if (ere2) {
		var res = tryparsing(ere2[2]);
		lines_out.push({msgtext: ere2[1], ast: res});
		continue;
	    }
	    var ere3 = re3.exec(line);
	    if (ere3) {
    		var res = tryparsing(ere3[2]);
		lines_out.push({msgtext: ere3[1], ast: res});
		continue;
	    }

	    // unknown line... complain?
	}

	message.textContent = JSON.stringify(lines_out, null, 4);
    }
    catch (e) {
        message.textContent = e.message;
    }
    return false;
}
window.onload = function() {
    var object = document.getElementById('parsebtn');
    object.addEventListener("click", parseit); 
}
