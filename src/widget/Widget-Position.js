/**
 * @module widget-position
 */
        var Lang = Y.Lang,
            Widget = Y.Widget,

            POSITION = "position",
            XY_COORD = "xy",

            POSITIONED = "positioned",
            BOUNDING_BOX = "boundingBox",

            RENDERUI = "renderUI",
            BINDUI = "bindUI",
            SYNCUI = "syncUI",

            UI = Widget.UI_SRC,

            PositionChange = "positionChange",
            XYChange = "xyChange";

        /**
         * @class WidgetPosition
         */
        function Position(config) {
            this._posNode = this.get(BOUNDING_BOX);

            // WIDGET METHOD OVERLAP
            Y.after(this._renderUIPosition, this, RENDERUI);
            Y.after(this._syncUIPosition, this, SYNCUI);
            Y.after(this._bindUIPosition, this, BINDUI);
        }

        Position.ATTRS = {
            x: {
                set: function(val) {
                    this._setX(val);
                },
                get: function() {
                    return this._getX();
                }
            },

            y: {
                set: function(val) {
                    this._setY(val);
                },
                get: function() {
                    return this._getY();
                }
            },

            xy: {
                value:[0,0],
                validator: function(val) {
                    return this._validateXY(val);
                }
            },

            position: {
                value:"absolute"
            }
        };

        Position.POSITIONED_CLASS = Widget.getClassName(POSITIONED);

        Position.prototype = {

            _renderUIPosition : function() {
                this._posNode.addClass(Position.POSITIONED_CLASS);
            },

            _syncUIPosition : function() {
                this._uiSetPosition(this.get(POSITION));
                this._uiSetXY(this.get(XY_COORD));
            },

            _bindUIPosition :function() {
                this.after(PositionChange, this._onPositionChange);
                this.after(XYChange, this._onXYChange);
            },

            /**
             * Moves the Overlay to the specified position page x, y co-ordinate position.
             *
             * @method move
             *
             * @param {Number} x The new x position
             * @param {Number} y The new y position
             * <p>Or</p>
             * @param {Array} x, y values passed as an array (x = index 0, y = index 1), to support
             * simple pass through of Y.Node.getXY_COORD results
             */
            move: function () {
                var args = arguments,
                    coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];
                    this.set(XY_COORD, coord);
            },

            /**
             * Synchronizes the Panel's "xy", "x", and "y" properties with the 
             * Widget's position in the DOM.
             *
             * @method syncXY
             */
            syncXY : function () {
                this.set(XY_COORD, this._posNode.getXY(), {src: UI});
            },

            _validateXY : function(val) {
                return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));
            },

            _setX : function(val) {
                this.set(XY_COORD, [val, this.get(XY_COORD)[0]]);
            },

            _setY : function(val) {
                this.set(XY_COORD, [this.get(XY_COORD)[1], val]);
            },

            _getX : function() {
                return this.get(XY_COORD)[0];
            },

            _getY : function() {
                return this.get(XY_COORD)[1];
            },

            _onPositionChange : function(e) {
                this._uiSetPosition(e.newVal);
            },

            _onXYChange : function(e) {
                if (e.src != UI) {
                    this._uiSetXY(e.newVal);
                }
            },

            _uiSetPosition : function(val) {
                this._posNode.setStyle(POSITION, val);
            },

            _uiSetXY : function(val) {
                this._posNode.setXY(val);
            }
        };

        Y.WidgetPosition = Position;