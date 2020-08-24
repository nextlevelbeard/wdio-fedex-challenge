Feature: Search for a Planet

  The scenarios described are coupled to a particular Character search requirement

  # Rule: User selects Planet

  Background:
	Given I am on the Home page
	And I select Planets

  Scenario Outline: Searching for valid Planets should display their details : <query>
	When I search for <query>
	Then I should see a list of Planets
	And each Planet should display its details
		Examples:
			| query		|
  			| Da		|

  Scenario Outline: Making invalid search queries should not show any Planets : <query>
	When I search for <query>
	Then I should see a "Not Found" message
	And I should not see a list of Planets
	Examples:
	  |	query			|
	  |	Earth C-137		|

  Scenario: Searching for "Lu" should display specific Planets and not Characters
	When I search for Lu
	Then I should see some Planets listed
	  |	Name		| Population	| Climate		| Gravity		|
	  |	Felucia		| 8500000		| hot, humid	| 0.75 standard	|
	  |				| 18500000000	| superheated	| 				|
	And I should not see a list of characters

  Scenario Outline: Making a query can partially match several Planets : <query>
	When I search for <query>
	Then I should see multiple Planets
	And the Planets names should contain <query>
	  Examples:
		| query		|
		| Ca		|

  Scenario Outline: A valid Planet search like "<query>" should display a Not Found message for Characters
	When I search for <query>
	And I switch to People
	Then I should see a "Not Found" message
	And I should not see a list of Planets
	Examples:
	  |	query		|
	  |	Dagobah		|
	  |	Alderaan	|
	  | Naboo		|
