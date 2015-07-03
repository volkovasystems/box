/*:

*/
angular
	
	.module( "parseClassList", [ ] )
	
	.factory( "parseClassList", [
		function factory( ){
			var parseClassList = function parseClassList( classString ){
				return ( classString || "" ).split( " " ) || [ ];
			};

			return parseClassList;
		}
	] )

	.directive( "class", [
		"parseClassList",
		function directive( parseClassList ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, container, propertySet ){
					scope.classList = parseClassList( propertySet.class );

					$( container ).removeAttr( "class" );
				}
			}
		}
	] );