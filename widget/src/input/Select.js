define(
    ['text!../../res/input/selectTemplate.html'],
    function (selectTemplate) {

    //a wrapper module for controlling an HTML select element
    function Select(property) {
        this.property = property
        this.domElement = $(selectTemplate);

        this.options = [];
        this.changeCallbacks = [];

        this.on = this.on.bind(this);
        this.onChange = this.onChange.bind(this);

        this.init();
    }

    Select.prototype.init = function () {
        this.populate();
        $('select', this.domElement).on('change' , this.onChange);
    }

    Select.prototype.getDOM = function () {
        return this.domElement;
    }

    Select.prototype.on = function (event, callback) {
        if (event === 'change') {
            this.changeCallbacks.push(callback);
        }
    }

    Select.prototype.onChange = function (event) {
        var elem = event.target,
            value = this.options[$(elem).prop('selectedIndex')],
            self = this;

        this.changeCallbacks.forEach( function(callback) {
            callback && callback(value, self.property);
        })
    }

    Select.prototype.populate = function () {
        var self = this,
            selectedIndex = 0;

        selectedIndex = $('select', this.domElement).prop('selectedIndex');
        $('option', this.domElement).remove();

        self.options.forEach( function (option, index) {
            $('select', self.domElement)
                .append('<option value = "' + option[0] + '"' + ' >' +
                        option[1] + '</option>')
        })

        $('select', this.domElement).prop('selectedIndex', selectedIndex);
    }

    //add a single option in the form of a [value,label] pair
    Select.prototype.addOption = function (value, label) {
        var duplicate;
        this.options.push([value, label]);
        this.populate();
    }

    //add a set of options in the form of [value,label] pairs
    Select.prototype.setOptions = function (options) {
        this.options = options;
        this.populate();
    }

    Select.prototype.setSelected = function (value) {
        var selectedIndex = 0,
            selectedOption,
            self = this;

        this.options.forEach (function (option, index) {
            if (option[0] === value) {
                selectedIndex = index;
            }
        });
        $('select', this.domElement).prop('selectedIndex', selectedIndex);

        selectedOption = this.options[selectedIndex];
        this.changeCallbacks.forEach( function(callback) {
            callback && callback(selectedOption, self.property);
        })
    }

    Select.prototype.getSelected = function () {
        return $('select', this.domElement).prop('value');
    }

    return Select;
});