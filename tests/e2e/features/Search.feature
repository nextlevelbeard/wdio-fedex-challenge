Feature: Search feature

  The scenarios described are decoupled from any specific Search category

  Background:
	Given I am on the Home page

  Scenario: People is the default Search category
	Then People should be selected

  Scenario Outline: Previous search results are removed when making a blank query in <category>
	Given I select <category>
	And I search for "a"
	And I clear the form
	When I press Search
	Then I should not see any search results
	  Examples:
	  |	category	|
	  |	Planets		|
	  |	People		|

  Scenario Outline: Can search for <category> by pressing Enter
	Given I select <category>
	And I enter "a"
	When I press Enter on the Search form
	Then I should see a list of <category>
	Examples:
	  |	category	|
	  |	Planets		|
	  |	People		|


