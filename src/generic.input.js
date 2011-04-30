(function($) {
    $.fn.genericInput = function(options) {
        var defaults = {
        };
        
        // Extend our default options with those provided.
        var opts = $.extend(defaults, options);

        // iterate and reformat each matched element
        return this.each(function() {
            var $this = $(this);
            var input_value = $this.val();
            $this.css('display', 'none');
            $this.after('<table cellspacing="0" cellpadding="0" class="generic_input"><tr><td><select onchange="$.fn.genericInput.updateInputType(this);"><option value="string">String</option><option value="number">Number/Code</option><option value="array">Array</option><option value="tuple">Tuple</option><option value="dict">Dict</option></select><a href="#" onclick="$(this).prev().css(\'display\', \'inline\'); $(this).css(\'display\', \'none\'); return false;" class="generic_input_data_type">&#9679;</a></td><td>&quot;<input type="text" /' + '>&quot;</td></tr></table>')
            var item = $this.next();
            while (item[0].nodeName.toLowerCase() != 'select') { item = item.children(':first-child');}
            $.fn.genericInput.updateInputType(item);
            
            $.fn.genericInput.loadValue($this, input_value);
        });
    };
    
    $.fn.genericInput.trim = function (stringToTrim) {
        return stringToTrim.replace(/^\s+|\s+$/g,"");
    };

    $.fn.genericInput.addslashes = function (str) {
        str=str.replace(/\\/g,'\\\\');
        str=str.replace(/\'/g,'\\\'');
        str=str.replace(/\"/g,'\\"');
        str=str.replace(/\0/g,'\\0');
        return str;
    };

    $.fn.genericInput.stripslashes = function (str) {
        str=str.replace(/\\'/g,'\'');
        str=str.replace(/\\"/g,'"');
        str=str.replace(/\\0/g,'\0');
        str=str.replace(/\\\\/g,'\\');
        return str;
    };

    $.fn.genericInput.deleteItem = function (self) {
        var $this = $(self);
        var new_value = '';
        var table_item = $this.parent().parent().parent();
        var item = $this;
            while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
        $this.parent().parent().remove();
        table_item.children('tr').children('td').children('input').each ( function() {
                new_value += $(this).val() + ', ';
            });
            item.prev().val(new_value);
            item.prev().change();
    };

    $.fn.genericInput.addItem = function (self) {
        var $this = $(self);
        var new_input = '<tr><td><input type="text" /' + '></td><td><a href="#" onclick="$.fn.genericInput.deleteItem(this); return false;" class="generic_input_minus">&ndash;</a></td></tr>';
        $this.parent().parent().before(new_input);
        $this.parent().parent().prev().children(':first-child').children(':first-child').genericInput();
        var prev_val = $this.parent().parent().prev().prev().children(':first-child').children(':first-child').next().find('select').first().val();
        if(prev_val == null) prev_val = 'string';
        $this.parent().parent().prev().children(':first-child').children(':first-child').next().find('select').first().val(prev_val);
        $this.parent().parent().prev().children(':first-child').children(':first-child').next().find('select').first().change();
        $this.parent().parent().prev().children(':first-child').children(':first-child').change(function (e) {
                var item = $(this);
                var new_value = '';
                while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                item.prev().val('');
                var table_item = item;
                while ( table_item.children(':first-child')[0].nodeName.toLowerCase() != 'tr' ) { table_item = table_item.children(':first-child'); }
                var count=0;
                table_item.children('tr').children('td').children('input').each ( function() {
                        new_value += $(this).val() + ', ';
                    });
                item.prev().val(new_value);
                item.prev().change();
            });
        $this.parent().parent().prev().children(':first-child').children(':first-child').change();
    };

    $.fn.genericInput.deleteItemDict = function (self) {
        var $this = $(self);
        var new_value = '';
        var table_item = $this.parent().parent().parent();
        var item = $this;
            while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                $this.parent().parent().remove();
                        table_item.children('tr').children('td').children('input').each ( function(count) {
                                if(count % 2 == 0)
                                    new_value += $(this).val() + ': ';
                                else
                                    new_value += $(this).val() + ', ';
                                count = count + 1;
                            });
                item.prev().val(new_value);
                item.prev().change();
    };

    $.fn.genericInput.addItemDict = function (self) {
        var $this = $(self);
        var new_input = '<tr><td><input type="text" /' + '></td><td>:</td><td><input type="text" /' + '></td><td><a href="#" onclick="$.fn.genericInput.deleteItemDict(this); return false;" class="generic_input_minus">&ndash;</a></td></tr>';
        $this.parent().parent().before(new_input);
        $this.parent().parent().prev().children(':first-child').children(':first-child').genericInput();
        $this.parent().parent().prev().children(':first-child').next().next().children(':first-child').genericInput();
        var prev_val = $this.parent().parent().prev().prev().children(':first-child').children(':first-child').next().find('select').first().val();
        if(prev_val == null) prev_val = 'string';
        $this.parent().parent().prev().children(':first-child').children(':first-child').next().find('select').first().val(prev_val);
        $this.parent().parent().prev().children(':first-child').children(':first-child').next().find('select').first().change();
        
        prev_val = $this.parent().parent().prev().prev().children(':first-child').next().next().children(':first-child').next().find('select').first().val();
        if(prev_val == null) prev_val = 'string';
        $this.parent().parent().prev().children(':first-child').next().next().children(':first-child').next().find('select').first().val(prev_val);
        $this.parent().parent().prev().children(':first-child').next().next().children(':first-child').next().find('select').first().change();
        
        
        $this.parent().parent().prev().children(':first-child').children(':first-child').change(function (e) {
                var item = $(this);
                var new_value = '';
                while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                item.prev().val('');
                var table_item = item;
                while ( table_item.children(':first-child')[0].nodeName.toLowerCase() != 'tr' ) { table_item = table_item.children(':first-child'); }
                table_item.children('tr').children('td').children('input').each ( function(count) {
                        if(count % 2 == 0)
                            new_value += $(this).val() + ': ';
                        else
                            new_value += $(this).val() + ', ';
                        count = count + 1;
                    });
                item.prev().val(new_value);
                item.prev().change();
            });
        $this.parent().parent().prev().children(':first-child').next().next().children(':first-child').change(function (e) {
                $(this).parent().prev().prev().children(':first-child').change();
            });
        $this.parent().parent().prev().children(':first-child').children(':first-child').change();
    };

    $.fn.genericInput.updateInputType = function (self) {
        var $this = $(self);
        var old_value, old_id;
        old_value = $this.parent().next().children(':first-child').val();
        
        switch ($this.val()) {
            case 'string':
                $this.parent().next().html('&quot;<input type="text"/' + '>&quot;');
                $this.parent().next().children(':first-child').change( function(e) { 
                        var value = '"' + $.fn.genericInput.addslashes($(this).val()) + '"';
                        var item = $(this);
                        while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                        item.prev().val(value);
                        item.prev().change();
                    });
                break;
            case 'number':
                $this.parent().next().html('<input type="text" /' + '>');
                $this.parent().next().children(':first-child').change( function(e) { 
                        var value = $(this).val();
                        var item = $(this);
                        while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                        item.prev().val(value);
                        item.prev().change();
                    });
                break;
            case 'array':
                $this.parent().next().html('<input type="text" style="display: none;" /' + '>');
                $this.parent().next().append('<table cellspacing="0" cellpadding="0"><tr><td>[</td></tr><tr><td><a href="#" onclick="$.fn.genericInput.addItem(this); return false;" class="generic_input_plus">&#43;</a></td></tr><tr><td>]</td></tr></table>')
                $this.parent().next().children(':first-child').change( function(e) { 
                        var value = '[' + $(this).val() + ']';
                        var item = $(this);
                        while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                        item.prev().val(value);
                        item.prev().change();
                    });
                break;
            case 'tuple':
                $this.parent().next().html('<input type="text" style="display: none;" /' + '>');
                $this.parent().next().append('<table cellspacing="0" cellpadding="0"><tr><td>(</td></tr><tr><td><a href="#" onclick="$.fn.genericInput.addItem(this); return false;" class="generic_input_plus">&#43;</a></td></tr><tr><td>)</td></tr></table>')
                $this.parent().next().children(':first-child').change( function(e) { 
                        var value = '(' + $(this).val() + ')';
                        var item = $(this);
                        while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                        item.prev().val(value);
                        item.prev().change();
                    });
                break;
            case 'dict':
                $this.parent().next().html('<input type="text" style="display: none;" /' + '>');
                $this.parent().next().append('<table cellspacing="0" cellpadding="0"><tr><td>{</td></tr><tr><td><a href="#" onclick="$.fn.genericInput.addItemDict(this); return false;" class="generic_input_plus">&#43;</a></td></tr><tr><td>}</td></tr></table>')
                $this.parent().next().children(':first-child').change( function(e) { 
                        var value = '{' + $(this).val() + '}';
                        var item = $(this);
                        while (item[0].nodeName.toLowerCase() != 'table') { item = item.parent(); }
                        item.prev().val(value);
                        item.prev().change();
                    });
                break;
        }
        $this.parent().next().children(':first-child').val('');
        $this.parent().next().children(':first-child').change();
        $this.next().css('display', 'inline');
        $this.css('display', 'none');
    };

    $.fn.genericInput.fetchOneItem = function (input_string) {
        var r_brac=0, s_brac=0, f_brac=0, in_str=false;
        var result = Array();
        for(i=0; i<input_string.length; i++)
        {
            if(!in_str && input_string.charAt(i) == ',' && r_brac == 0 && s_brac == 0 && f_brac == 0)
            {
                result[0] = input_string.substring(0, i);
                result[1] = input_string.substring(i+1);
                return result;
            }
            if (input_string.charAt(i) == '"') {
                if(!in_str )
                {
                    in_str = true;
                }
                else if (in_str && input_string.charAt(i-1) != '\\')
                {
                    in_str = false;
                }
            }
            if (!in_str) {
                switch(input_string.charAt(i))
                {
                    case '(':
                        r_brac++;
                        break;
                    case ')':
                        r_brac--;
                        break;
                    case '[':
                        s_brac++;
                        break;
                    case ']':
                        s_brac--;
                        break;
                    case '{':
                        f_brac++;
                        break;
                    case '}':
                        f_brac--;
                        break;
                }
            }
        }
        result[0] = input_string.substring(0, i);
        result[1] = input_string.substring(i+1);
        return result;
    };

    $.fn.genericInput.fetchOneItemDict = function (input_string) {
        var r_brac=0, s_brac=0, f_brac=0, in_str=false;
        var result = Array();
        for(i=0; i<input_string.length; i++)
        {
            if(!in_str && input_string.charAt(i) == ':' && r_brac == 0 && s_brac == 0 && f_brac == 0)
            {
                result[0] = input_string.substring(0, i);
                result[1] = input_string.substring(i+1);
                return result;
            }
            if (input_string.charAt(i) == '"') {
                if(!in_str )
                {
                    in_str = true;
                }
                else if (in_str && input_string.charAt(i-1) != '\\')
                {
                    in_str = false;
                }
            }
            if (!in_str) {
                switch(input_string.charAt(i))
                {
                    case '(':
                        r_brac++;
                        break;
                    case ')':
                        r_brac--;
                        break;
                    case '[':
                        s_brac++;
                        break;
                    case ']':
                        s_brac--;
                        break;
                    case '{':
                        f_brac++;
                        break;
                    case '}':
                        f_brac--;
                        break;
                }
            }
        }
        result[0] = input_string.substring(0, i);
        result[1] = input_string.substring(i+1);
        return result;
    };

$.fn.genericInput.splitItems = function (input_string) {
    var result = Array();
    
    var i;
    input_string = input_string.substring(1, input_string.length-1);
    
    while(input_string != "")
    {
        var res = $.fn.genericInput.fetchOneItem(input_string);
        var item = res[0];
        result.push(item);
        input_string = res[1];
        input_string = $.fn.genericInput.trim(input_string);
    }
    return result;
};

$.fn.genericInput.loadValue = function (input_control, input_value)
{
    var elements;
    input_value = $.fn.genericInput.trim(input_value);
    switch(input_value.charAt(0))
    {
        case '"':
            input_control.next().find('select').first().val('string');
            input_control.next().find('select').first().change();
            input_control.next().find('input').first().val($.fn.genericInput.stripslashes(input_value.substring(1, input_value.length-1)));
            break;
        case '[':
            elements = $.fn.genericInput.splitItems(input_value);
            input_control.next().find('select').first().val('array');
            input_control.next().find('select').first().change();
            input_control.next().find('input').first().val(input_value);
            for(var i=0; i<elements.length; i++)
            {
                input_control.next().find('a').last().click();
                $.fn.genericInput.loadValue(input_control.next().find('a').last().parent().parent().prev().find('input').first(), elements[i]);
            }
            break;
        case '(':
            elements = $.fn.genericInput.splitItems(input_value);
            input_control.next().find('select').first().val('tuple');
            input_control.next().find('select').first().change();
            input_control.next().find('input').first().val(input_value);
            for(var i=0; i<elements.length; i++)
            {
                input_control.next().find('a').last().click();
                $.fn.genericInput.loadValue(input_control.next().find('a').last().parent().parent().prev().find('input').first(), elements[i]);
            }
            break;
        case '{':
            elements = $.fn.genericInput.splitItems(input_value);
            input_control.next().find('select').first().val('dict');
            input_control.next().find('select').first().change();
            input_control.next().find('input').first().val(input_value);
            for(var i=0; i<elements.length; i++)
            {
                input_control.next().find('a').last().click();
                var item = $.fn.genericInput.fetchOneItemDict(elements[i]);
                var key_item = input_control.next().find('a').last().parent().parent().prev().find('input').first();
                var val_item = key_item.parent().next().next().children(':first-child');
                $.fn.genericInput.loadValue(key_item, item[0]);
                $.fn.genericInput.loadValue(val_item, item[1]);
            }
            break;
        default:
            input_control.next().find('select').first().val('number');
            input_control.next().find('select').first().change();
            input_control.next().find('input').first().val(input_value);
            break;
    }
    input_control.next().find('input').first().change();
};

})(jQuery);

