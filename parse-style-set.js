/*:

*/
angular
	
	.module( "parseStyleSet", [ ] )
	
	.factory( "parseStyleSet", [
		function factory( ){
			var parseStyleSet = function parseStyleSet( style ){
				var styleList = ( style || "" ).split( ";" ) || [ ];

				var styleSet = { };

				_.each( styleList,
					function onEachStyleString( styleString ){
						var styleData = styleString.split( ":" );

						var styleName = S( styleData[ 0 ] ).camelize( );

						styleSet[ styleName ] = styleData[ 1 ];
					} );

				return styleSet;
			};

			return parseStyleSet;	
		}
	] )

	.directive( "style", [
		"parseStyleSet",
		function directive( parseStyleSet ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, container, propertySet ){
					scope.styleSet = parseStyleSet( propertySet.style );

					$( container ).removeAttr( "style" );
				}
			}
		}
	] );