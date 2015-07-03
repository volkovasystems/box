/*:
	Box Template

		This will be used as the template for creating
			boxed components.

		It provides clear, concise, and essential capabilities
			needed to manipulate a component.

		First we need to answer three things when we handle components.
			1. How do we handle events? (Event.js)
			2. How do we handle layouting? (PageFlow.js)
			3. How do we handle data? (Store.js)

		What are the advantages?

			Box wraps and delegates your components.

			You see the code and you can change it.

			Basically it is like this:

				"your component" -->[Box]===[Box Template]--> "your Boxed component"

			Simple right?

		Though we hardly discouraged the changing of the generated
			boxed component module, because we provide a way to
			access them by injecting extensions/plugins.

			This is more safer. Rare cases if you really need
				to modify then you can do so. 

			But don't blame us yeah?
*/
angular
	
	.module( "@nameTitle", [ 
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
	.factory( "get@nameTitle", [
		function factory( ){
			var get_nameTitle_View = function get_nameTitle_View( defaultView ){
				var view; //: @template: template/@template-file.html

				return view || defaultView;
			};

			return get_nameTitle_View;
		}
	] )

	.factory( "@nameTitle", [
		"boxify",
		"generateUUIDForDOMID",
		
		"get@nameTitleView",
		function factory( 
			boxify,
			generateUUIDForDOMID,
			get_nameTitle_View
		){
			var _nameTitle_ = React.createClass( {
				"getInitialState": function getInitialState( ){
					return {
						"id": "",
						"classList": null,
						"styleSet": null,

						"@property:@propertyName": "@propertyName:@value",

						"@end": ""
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"id": generateUUIDForDOMID( ),
						"classList": [ ],
						"styleSet": { },

						"@property:@propertyName": "@propertyName:@value",

						"@end": ""
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

				"@propertyGet:@propertyTitle": function _propertyGet__propertyTitle_( ){
					return this.state._propertyName_ || this.props._propertyName_;
				},

				"@event:@eventTitle": function _event__eventTitle_( event ){
					this.props._event__eventTitle_.call( this, event );
				},

				"render": function onRender( ){
					//: We revert to default if a custom template is not given.
					return get_nameTitle_View(
						<_componentDOMName_ 
							id={ this.getID( ) }
							className={ this.getClassString( ) }  
							style={ this.getStyleSet( ) }

							_property__propertyName_={ this.get_propertyTitle_ }

							_event__eventTitle_={ this._event__eventTitle_ }

							_end_>
						</_componentDOMName_>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					//: @property-change-procedure-template:
					if( !_.isEqual( prevProps._propertyName_, this.props._propertyName_ ) || 
						!_.isEqual( prevState._propertyName_, this.state._propertyName_ ) )
					{
						this._propertyOnChangeHandler_(  )
					}
					//: @end-property-change-procedure-template
				} 
			} );

			boxify( _nameTitle_ );  

			return _nameTitle_;
		}
	] )

	.factory( "attach@nameTitle", [
		"$rootScope",

		"@nameTitle",
		function factory( 
			$rootScope, 

			_nameTitle_ 
		){
			var attach_nameTitle_ = function attach_nameTitle_( container, propertySet, optionSet ){
				var scope = propertySet.scope || $rootScope;

				scope = scope.$new( true );

				_nameTitle_.attach( container, propertySet, optionSet );
			};

			return attach_nameTitle_;
		}
	] )

	/*:
		This will enable us to attach the component via Angular's directive approach.
	*/
	.directive( "textInput", [
		"parseStyleSet",
		"parseClassList",
		"generateUUIDForDOMID",

		"attach@nameTitle",
		function directive( 
			parseStyleSet,
			parseClassList,
			generateUUIDForDOMID,

			attach_nameTitle_
		){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"replace": true,
				"template": "<section></section>",
				"link": function onLink( scope, container, propertySet ){
					/*:
						tl;dr
							The fact that I can do doesn't mean I need to.

							I prefer this way, why?

							I may put this inside the template function or
								a compile function.

							But I didn't.

							The reason is that first, I want to remove possible cases
								of infinite recursion through digestion of angular.

							Second, If angular digest the internals of react,
								angular might change the DOM structure which in turn
								react is not aware of thus it may crash react because
								it is also keeping the state of the DOM structure.

							Separation of concerns, third, let react handle the DOM
								and let angular handle the attachment, modularization
								and inter module communication.
					*/
					attach_nameTitle_( container,
						//: This will be attached to the props.
						//: This will also flow inside the initialize method if provided.
						//: Most of the stuffs here is component specific.
						{
							"scope": 			scope,
							"container": 		$( "section", container ),
							
							"id": 				scope.id || propertySet.id || generateUUIDForDOMID( ),
							"classList": 		scope.classList || parseClassList( propertySet.class ),
							"styleSet": 		scope.styleSet || parseStyleSet( propertySet.style )

							"@property:@propertyName": propertySet._propertyName_,

							"@end": ""
						},

						//: This will flow inside the configure method if provided.
						{
							"initialize": 		scope.initialize,
							"configure": 		scope.configure,
							"namespace": 		scope.namespace,

							"@event:@eventTitle": scope._event__eventTitle_,

							"@end": ""
						} );
				}
			};
		}
	] );