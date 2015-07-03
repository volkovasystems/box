angular.module( "TextInputController", [ ] )
	.directive( "textInputController", [
		function directive( ){
			return {
				"restrict": "A",
				"priority": 1,
				"scope": true,
				"link": function onLink( scope, container, propertySet ){
					scope.configure = function configure( optionSet ){
						this.setProps( {
							"onChangeValue": optionSet.onChangeValue
						} );
					};

					scope.onChange = function onChange( value ){
						console.log( value );
					};
				}
			};
		}
	] );