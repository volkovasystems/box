/*:
	This was created with the purpose of filling the id attribute
		if the developer forgets it.

	The implementation is simple.
		1. Join v1 and v4 with colon to make the id time based and random.
		2. Simplify and obfuscate by encoding it to base 64.

	This will make the id simple and unique and hard to reference via id.

	tl;dr
		Why is this important?
			The UUID used as DOM ID make the DOM element unique.

			This uniqueness enable us to reference the DOM element accurately.

			But then we also need to find a way that we can reference these elements securely.

			The long length of base64 encoded concatenated v1 and v4 UUID provide a layer of security
				to anyone maliciously manipulating the DOM.

				1. The ID is obfuscated and random.
				2. The ID can be referenced privately and internally using the API.
				3. The ID can be hardly reference outside without learning the code.
				4. The ID is hard to read.
*/
angular
	
	.module( "generateUUIDForDOMID", [ ] )

	.factory( "generateUUIDForDOMID", [
		function factory( ){
			var generateUUIDForDOMID = function generateUUIDForDOMID( ){
				return btoa( [ uuid.v1( ), uuid.v4( ) ].join( ":" ) )
			};

			return generateUUIDForDOMID;	
		}
	] )

	/*:
		This decoder is used to exposed the v1 and v4 uuid.
	*/
	.factory( "decodeUUIDFromDOMID", [
		function factory( ){
			var decodeUUIDFromDOMID = function decodeUUIDFromDOMID( uuidData ){
				uuidData = atob( uuidData ).split( ":" );

				return {
					"uuidV1": uuidData[ 0 ],
					"uuidV4": uuidData[ 1 ]
				};
			};

			return decodeUUIDFromDOMID;
		}
	] )

	/*:
		The ID_LIST will be used to track all IDs recorded to make sure they are unique.
	*/
	.constant( "ID_LIST", [ ] )

	/*:
		We add a directive to id. 
		The developer may add an empty id if he wants to generate a uuid for the id.
		Or he can add a unique id.
	*/
	.directive( "id", [
		"generateUUIDForDOMID",
		"ID_LIST",
		function directive( 
			generateUUIDForDOMID,
			ID_LIST
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, container, propertySet ){

					scope.id = generateUUIDForDOMID( );

					if( propertySet.id ){
						if( !_.contains( ID_LIST, propertySet.id ) ){
							scope.id = propertySet.id;

						}else{
							console.warn( "id is not unique so we will use the generate id", propertySet.id );
						}
					}

					ID_LIST.push( scope.id );

					//: We need to listen when the scope is destroyed so that we can remove the ID in the ID_LIST.
					scope.$on( "$destroy",
						function onDestroy( ){
							var idListLength = ID_LIST.length;

							var ID = "";
							for( var index = 0; index < idListLength; index++ ){
								ID = ID_LIST[ index ];
								
								if( ID == scope.id ){
									ID_LIST.splice( index, 1 );

									break;
								}
							}
						} );
				}
			}
		}
	] );