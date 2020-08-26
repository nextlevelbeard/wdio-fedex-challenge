Feature: Search for a Character

  The scenarios described are coupled to a particular Character search requirement

  # Rule: User selects People

  Background:
	Given I am on the Home page
	And I press People

  Scenario Outline: Searching for valid Characters should display their details : <query>
	When I search for <query>
	Then I should see a list of Characters
	And each Character should display its details
	Examples:
	  |	query	|
	  |	Po		|

  Scenario Outline: Making invalid search queries should not show any characters : <query>
	When I search for <query>
	Then I should see a "Not Found" message
	And I should not see a list of Characters
	Examples:
	  |	query			|
	  |	Earth C-137		|

  Scenario: Searching for "Lu" should display specific Characters and not Planets
	When I search for Lu
	Then I should see some Characters listed
		| Name				| Gender	| Birth year	| Eye color	| Skin color	|
		| Luke Skywalker	| Male		| 19BBY			| Blue		| Fair			|
		|					| Female  	| 58BBY			|			|       		|
	And I should not see a list of planets

  Scenario Outline: Making a query can partially match several Characters : <query>
	When I search for <query>
	Then I should see multiple Characters
	And the Characters names should contain <query>
	Examples:
	  | query		|
	  | Ca			|

  Scenario Outline: A valid Character search like "<query>" should display a Not Found message for Planets
	When I search for <query>
	And I switch to Planets
	Then I should see a "Not Found" message
	And I should not see a list of Characters
	Examples:
	  |	query		|
	  |	Luke		|
	  |	Anakin		|
	  | 3			|
