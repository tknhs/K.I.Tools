(function($){
    'use strict';

    $.fn.iToggle = function(opts) {
        var options, defaults = {
            speed: 70,
            defaultOffLabel: 'no',
            defaultOnLabel: 'yes'
        };
        options = $.extend(defaults, $.fn.iToggle.defaultOptions, opts);

        return this.each(function(){
            var el = $(this), box, labelOn, labelOff, slider;

            if(el[0].tagName == 'INPUT' && el.attr('type') === 'checkbox') {
                el.css({
                    position: 'absolute',
                    left: -10000
                });
                buildSlider();
                el.after(box);
                setupDimensions();

                // if the input is wrapped in a label element, it will work natively
                // without a click handler
                if (el.parents('label').length === 0) {
                    box.on('click', toggle);
                }
                el.on('change', onStateChange);
                el.on('focus', onFocus);
                el.on('blur', onBlur);
            }

            function onFocus() {
                box.addClass('focus');
            }

            function onBlur() {
                box.removeClass('focus');
            }

            function buildSlider() {
                box = $('<div />');
                box.addClass('iToggle');
                box.css({
                    position: 'relative',
                    overflow: 'hidden',
                    '-webkit-box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    '-ms-box-sizing': 'border-box',
                    '-o-box-sizing': 'border-box',
                    'box-sizing': 'border-box'
                });

                function basicLabel(className, text) {
                    var label = $('<span />')
                        .addClass('label')
                        .addClass(className)
                        .css({ // avoid selection
                            '-moz-user-select': '-moz-none',
                            '-khtml-user-select': 'none',
                            '-webkit-user-select': 'none',
                            '-ms-user-select': 'none',
                            'user-select': 'none',
                        })
                        .html(text);

                    label.on('mousedown', function() {return false;}); // disable text selection

                    return label;
                }

                labelOff = basicLabel('label-off', el.data('label-off') ? el.data('label-off') : options.defaultOffLabel);
                box.append(labelOff);
                labelOn = basicLabel('label-on', el.data('label-on') ? el.data('label-on') : options.defaultOnLabel);
                box.append(labelOn);

                slider = $('<div />');
                slider.addClass('slider');
                slider.css({
                    position: 'absolute',
                    top: 0
                });
                box.append(slider);
            }

            function setupDimensions() {
                if (labelOn && labelOff) {
                    var maxWidth = Math.max(labelOn.outerWidth(), labelOff.outerWidth());
                    var height = box.height();
                    var innerHeight = box.innerHeight();
                    var css = {
                        width: maxWidth,
                        height: height,
                        'line-height': innerHeight+'px',
                        // remove padding, they were taken into account and break the certical centering with line-height
                        'padding-top': 0,
                        'padding-bottom': 0
                    };
                    labelOn.css(css);
                    labelOff.css(css);
                    slider.css('width', maxWidth);
                }
                slider.css({
                    height: box.innerHeight(),
                    left: isOn() ? 0 : Math.round(box.innerWidth()/2)
                });
            }

            // called when checkbox is clicked
            function onStateChange() {
                return isOn() ? toggleOn() : toggleOff();
            }

            function toggle() {
                el.prop('checked', !isOn());
                onStateChange();
                // trigger event on original checkbox
                el.trigger('change');
            }

            function toggleOn() {
                slider.animate({left: 0}, options.speed);
            }

            function toggleOff() {
                slider.animate({left: Math.round(box.innerWidth()/2)}, options.speed);
            }

            function isOn() {
                return el.prop('checked');
            }
        });
    };
})(jQuery);