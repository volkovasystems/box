angular
	
	.module( "TextInput", [ 
		"Box", 
		"parseStyleSet", 
		"parseClassList",
		"generateUUIDForDOMID" 
	] )

	/*:
		This enable us to use either the default view OR the template view.

		It is reasonable to add all template views to the template directory.

		The template should be simple.
	*/
	.factory( "getTextInputView", [
		function factory( ){
			var getTextInputView = function getTextInputView( defaultView ){
				var view; //: @template: template/text-input.html

				return view || defaultView;
			};

			return getTextInputView;
		}
	] )

	.factory( "TextInput", [
		"boxify",
		"getTextInputView",
		"generateUUIDForDOMID",
		function factory( 
			boxify,
			getTextInputView,
			generateUUIDForDOMID 
		){
			var TextInput = React.createClass( {
				"getInitialState": function getInitialState( ){
					return {
						"id": "",
						"classList": null,
						"styleSet": null,

						"name": "",
						"title": "",
						"placeholder": "",
						
						"value": ""
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"id": generateUUIDForDOMID( ),
						"classList": [ ],
						"styleSet": { },

						"name": "inputText",
						"title": "Text",
						"placeholder": "Type something...",
						
						"value": ""
					};
				},

				"getID": function getID( ){
					return this.state.id || this.props.id;
				},

				"getClassList": function getClassList( ){
					return this.state.classList || this.props.classList;
				},

				"getClassString": function getClassString( ){
					return this.getClassList( ).join( " " );
				},

				"getStyleSet": function getStyleSet( ){
					return this.state.styleSet || this.props.styleSet;
				},

				"getName": function getName( ){
					return this.state.name || this.props.name;
				},

				"getTitle": function getTitle( ){
					return this.state.title || this.props.title;
				},

				"getPlaceholder": function getPlaceholder( ){
					return this.state.placeholder || this.props.placeholder;
				},

				"getValue": function getValue( ){
					return this.state.value || this.props.value;
				},

				"getType": function getType( ){
					return this.state.type || this.props.type || "text";
				},

				"onKeyPress": function onKeyPress( event ){
					this.props.onKeyPress.call( this, event );
				},

				"onClick": function onClick( event ){
  					this.props.onClick.call( this, event );
				},

				"onChange": function onChange( event ){
					this.props.onChange.call( this, event );
				},

				"render": function onRender( ){
					//: We revert to default if a custom template is not given.
					return getTextInputView(
						<input 
							id={ this.getID( ) }
							className={ this.getClassString( ) }  
							style={ this.getStyleSet( ) }

							name={ this.getName( ) }
							title={ this.getTitle( ) }
							placeholder={ this.getPlaceholder( ) }

							type={ this.getType( ) }
							value={ this.getValue( ) }

							onChange={ this.onChange }
							onClick={ this.onClick }
							onKeyPress={ this.onKeyPress } />
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					
				} 
			} );

			boxify( TextInput );  

			return TextInput;
		}
	] )

	.factory( "attachTextInput", [
		"$rootScope",
		"TextInput",
		function factory( $rootScope, TextInput ){
			var attachTextInput = function attachTextInput( container, propertySet, optionSet ){
				var scope = propertySet.scope || $rootScope;

				scope = scope.$new( true );

				TextInput.attach( container, propertySet, optionSet );
			};

			return attachTextInput;
		}
	] )

	/*:
		This will enable us to attach the component via Angular's directive approach.
	*/
	.directive( "textInput", [
		"attachTextInput",
		
		"parseStyleSet",
		"parseClassList",
		"generateUUIDForDOMID",
		function directive( 
			attachTextInput,

			parseStyleSet,
			parseClassList,
			generateUUIDForDOMID
		){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"template": "<section></section>",
				"replace": true,
				"link": function onLink( scope, container, propertySet ){
					attachTextInput( container,
						//: This will be attached to the props.
						//: This will also flow inside the initialize method if provided.
						//: Most of the stuffs here is component specific.
						{
							"scope": 			scope,
							"container": 		$( "section", container ),
							
							"name": 			propertySet.name,
							"title": 			propertySet.title,
							"placeholder": 		propertySet.placeholder,
							"value": 			propertySet.value,

							"id": 				scope.id || propertySet.id || generateUUIDForDOMID( ),
							"classList": 		scope.classList || parseClassList( propertySet.class ),
							"styleSet": 		scope.styleSet || parseStyleSet( propertySet.style )
						},

						//: This will flow inside the configure method if provided.
						{
							"initialize": 		scope.initialize,
							"configure": 		scope.configure,

							"onChange": 		scope.onChange
						} );
				}
			};
		}
	] );