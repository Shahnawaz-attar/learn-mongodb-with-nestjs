// UserController
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/pagination')
  async findUsersWithPagination(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<User[]> {
    return this.userService.findUsersWithPagination(page, pageSize);
  }

  @Get('/search')
  async searchUserByText(@Query('query') query: string): Promise<User[]> {
    try {
      console.log(query);
      return await this.userService.searchUsersByText(query);
    } catch (error) {
      console.error('Error in searchUserByText:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  @Get('/statistics')
  async aggregateUserStatistics(): Promise<any> {
    return this.userService.aggregateUserStatistics();
  }

  @Get('/populate/:userId')
  async getUserWithAddress(@Param('userId') userId: string): Promise<any> {
    console.log(userId);
    try {
      return this.userService.getUserWithAddress(userId);
    } catch (error) {
      console.error('Error in searchUserByText:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('/getUserAge/:age')
  async findUsersWithAgeGreaterThan(
    @Param('age') age: number,
  ): Promise<User[]> {
    return this.userService.findUsersWithAgeGreaterThan(age);
  }

  @Get('/searchByWildCard')
  async searchUsersByWildcard(@Query('query') query: string): Promise<User[]> {
    try {
      console.log(query);
      return await this.userService.searchUsersByWildcard(query);
    } catch (error) {
      console.error('Error in searchUserByText:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Post('/userByCities')
  async findUsersInCity(@Body('cities') cities: string[]): Promise<User[]> {
    return await this.userService.findUsersInCity(cities);
  }

  @Get('/getUserBySkill')
  async findUsersWithSpecificSkill(@Query('skill') skill: string) {
    return this.userService.findUsersWithSpecificSkill(skill);
  }

  @Post('/addSkillToUser/:userId')
  async addSkillToUser(
    @Param('userId') userId: string,
    @Body('skill') skill: string,
  ): Promise<User> {
    return this.userService.addSkillToUser(userId, skill);
  }

  @Get('/sortByName')
  async sortUsersByName(): Promise<User[]> {
    return this.userService.sortUsersByNameCaseInsensitive();
  }

  @Get('/usersWithAllSkills')
  async findUsersWithAllSkills(
    @Query('skills') requiredSkills: string[],
  ): Promise<User[]> {
    return this.userService.findUsersWithAllSkills(requiredSkills);
  }

  @Get('/redactSensitiveData/:userId')
  async redactSensitiveData(@Param('userId') userId: string): Promise<User> {
    return this.userService.redactSensitiveData(userId);
  }

  @Get('/getUsersWithAddresses')
  async getUsersWithAddresses() {
    return this.userService.getUsersWithAddresses();
  }

  @Get('/sameName')
  async findUsersWithSameFirstNameAndLastName(): Promise<User[]> {
    return this.userService.findUsersWithSameFirstNameAndLastName();
  }

  @Get('/bucketByAge')
  async bucketUsersByAge(): Promise<any> {
    return this.userService.bucketUsersByAge();
  }

  @Get('/weightedTextSearch')
  async weightedTextSearch(@Query('query') query: string): Promise<User[]> {
    return this.userService.weightedTextSearch(query);
  }

  @Post('/compoundQuery')
  async compoundQuery(
    @Body() conditions: { $and: any[]; $or: any[] },
  ): Promise<User[]> {
    return this.userService.compoundQuery(conditions);
  }

  @Get('/leanUsers')
  async getLeanUsers() {
    return this.userService.getLeanUsers();
  }

  @Get('/findUsersNotInCity/:city')
  async findUsersNotInCity(@Param('city') city: string) {
    return this.userService.findUsersNotInCity(city);
  }
  @Get('/findUsersWithEmail')
  async findUsersWithEmail(@Query('email') email: string) {
    return this.userService.findUsersWithEmail(email);
  }

  @Get('/findUsersWithLimitedSkills')
  async findUsersWithLimitedSkills(@Query('limit') limit: number) {
    return this.userService.findUsersWithLimitedSkills(limit);
  }
  @Get('/findUsersWithSpecificNumberOfSkills')
  async findUsersWithSpecificNumberOfSkills(
    @Query('skillCount') skillCount: number,
  ) {
    console.log('Received skillCount:', skillCount);

    try {
      return this.userService.findUsersWithSpecificNumberOfSkills(skillCount);
    } catch (error) {
      console.error('Error in searchUserByText:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('searchUsersByMulityPattern')
  async searchUsersByMulityPattern(
    @Query('patterns', ParseArrayPipe) patterns: string[],
  ): Promise<User[]> {
    return this.userService.findUsersByMultiplePatterns(patterns);
  }

  @Get('oldest-and-youngest')
  async findOldestAndYoungestUsers(): Promise<{
    oldest: User;
    youngest: User;
  }> {
    return this.userService.findOldestAndYoungestUsers();
  }

  @Get('complexQueryWithAndOr')
  async complexQueryWithAndOr(
    @Query('age') age: number,
    @Query('city') city: string,
    @Query('jobTitle') jobTitle: string,
  ): Promise<User[]> {
    return this.userService.complexQueryWithAndOr(age, city, jobTitle);
  }

  @Get('howToUseTypeOpertorExample')
  async findUsersWithPhoneNumber(): Promise<User[]> {
    return this.userService.findUsersWithPhoneNumber();
  }

  @Get('removeAvatarFromUser/:userId')
  async removeAvatarFromUser(@Param('userId') userId: string): Promise<User> {
    console.log(userId, 'userId');
    return this.userService.removeAvatarFromUser(userId);
  }

  @Get('find-users-elemMatch-ne')
  async findUsersWithSpecificSkillNotInCity(
    @Query('skill') skill: string,
    @Query('city') city: string,
  ): Promise<User[]> {
    return this.userService.findUsersWithSpecificSkillNotInCity(skill, city);
  }

  @Get('find-users-custom-where-opr')
  async findUsersWithCustomCondition(
    @Query('customCondition') customCondition: string,
  ): Promise<User[]> {
    return this.userService.findUsersWithCustomCondition(customCondition);
  }

  @Get('find-users-expr-in-nin')
  async findUsersWithExprAndInAndNin(
    @Query('age', ParseIntPipe) age: number,
    @Query('cities', ParseArrayPipe) cities: string[],
  ): Promise<User[]> {
    console.log(age, 'age');
    console.log(cities, 'cities');
    try {
      return this.userService.findUsersWithExprAndInAndNin(age, cities);
    } catch (error) {
      console.error('Error in searchUserByText:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Get('mergeUsersIntoNewCollection')
  async mergeUsersIntoNewCollection(): Promise<void> {
    return this.userService.mergeUsersIntoNewCollection();
  }

  @Get('facet-users')
  async facetUsersByAgeAndCity(): Promise<{ byAge: User[]; byCity: User[] }> {
    return this.userService.facetUsersByAgeAndCity();
  }

  @Get('find-users-type-and-in')
  async findUsersWithTypeAndIn(
    @Query('age', ParseIntPipe) age: number,
    @Query('phoneNumber') phoneNumber: string,
  ): Promise<User[]> {
    return this.userService.findUsersWithTypeAndIn(age, phoneNumber);
  }

  @Get('switch-user-fields')
  async switchUserFieldsBasedOnCondition(
    @Query('condition', ParseBoolPipe) condition: boolean,
  ): Promise<User[]> {
    return this.userService.switchUserFieldsBasedOnCondition(condition);
  }

  @Get('groupAndSumUsersByAge')
  async groupAndSumUsersByAge() {
    return this.userService.groupAndSumUsersByAge();
  }

  @Get('auto-bucket-users-by-age')
  async autoBucketUsersByAge(): Promise<any[]> {
    return this.userService.autoBucketUsersByAge();
  }

  @Get('lookup-users-with-address-and-skills')
  async lookupUsersWithAddressAndSkills(): Promise<any[]> {
    return this.userService.lookupUsersWithAddressAndSkills();
  }

  @Get('facet-with-unwind-and-group')
  async facetWithUnwindAndGroup(): Promise<any[]> {
    return this.userService.facetWithUnwindAndGroup();
  }

  @Get('lookup-with-let-and-eq')
  async lookupWithLetAndEq(): Promise<any[]> {
    return this.userService.lookupWithLetAndEq();
  }

  @Get('lookup-with-merge-objects/:userId')
  async lookupWithMergeObjects(
    @Param('userId') userId: string,
  ): Promise<any[]> {
    return this.userService.lookupWithMergeObjects(userId);
  }
  @Get('sample-random-users')
  async sampleRandomUsers(
    @Query('count', ParseIntPipe) count: number,
  ): Promise<User[]> {
    return this.userService.sampleRandomUsers(count);
  }

  @Get('merge-with-expr-condition/:userId')
  async mergeWithExprCondition(
    @Param('userId') userId: string,
  ): Promise<User[]> {
    return this.userService.mergeWithExprCondition(userId);
  }

  @Get('sort-text-search-results')
  async sortTextSearchResults(@Query('query') query: string): Promise<User[]> {
    return this.userService.sortTextSearchResults(query);
  }

  @Get('facet-with-unwind-and-sort-by-count')
  async facetWithUnwindAndSortByCount(): Promise<any[]> {
    return this.userService.facetWithUnwindAndSortByCount();
  }

  @Get('bucket-and-sum-by-age-range')
  async bucketAndSumByAgeRange(): Promise<any[]> {
    return this.userService.bucketAndSumByAgeRange();
  }

  @Get('replace-root-and-array-to-object')
  async replaceRootAndArrayToObject(): Promise<any[]> {
    return this.userService.replaceRootAndArrayToObject();
  }

  @Get('execute-custom-function')
  async executeCustomFunction(): Promise<any[]> {
    return this.userService.executeCustomFunction();
  }

  @Get('lookup-with-let-eq-if-null')
  async lookupWithLetEqIfNull(): Promise<any[]> {
    return this.userService.lookupWithLetEqIfNull();
  }

  @Get('lookup-unwind-group-replace-root/:userId')
  async lookupWithUnwindGroupReplaceRoot(
    @Param('userId') userId: string,
  ): Promise<any[]> {
    return this.userService.lookupWithUnwindGroupReplaceRoot(userId);
  }

  @Get('function-with-map-filter-reduce')
  async functionWithMapFilterReduce(): Promise<any[]> {
    return this.userService.functionWithMapFilterReduce();
  }

  @Get('expr-with-all-elements-true')
  async exprWithAllElementsTrue(): Promise<User[]> {
    return this.userService.exprWithAllElementsTrue();
  }

  @Get('bucket-with-sum-and-cond')
  async bucketWithSumAndCond(): Promise<any[]> {
    return this.userService.bucketWithSumAndCond();
  }

  @Get('facet-with-bucket-and-sort-by-count')
  async facetWithBucketAndSortByCount(): Promise<any[]> {
    return this.userService.facetWithBucketAndSortByCount();
  }

  @Get('lookup-unwind-group-project')
  async lookupWithUnwindGroupProject(): Promise<any[]> {
    return this.userService.lookupWithUnwindGroupProject();
  }

  @Get('facet-bucket-auto-sort-limit')
  async facetWithBucketAutoSortByCountLimit(): Promise<any[]> {
    return this.userService.facetWithBucketAutoSortByCountLimit();
  }

  @Patch(':userId/rename-field')
  async renameFieldInUser(
    @Param('userId') userId: string,
    @Body('newFieldName') newFieldName: string,
  ): Promise<User> {
    return this.userService.renameFieldInUser(userId, newFieldName);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }

  @Get('/getUsername/:firstName')
  async getUsername(@Param('firstName') firstName: string) {
    console.log(firstName, 'firstName');
    return this.userService.findUserByUserName(firstName);
  }

  @Get('/getUserByLimit/:limit')
  async findLimitedUsers(@Param('limit') limit: number) {
    return this.userService.findLimitedUsers(limit);
  }

  @Get('/getSortedUser/:order')
  async findUsersSortedByAge(@Param('order') order: string) {
    const isAscendingOrder = order.toLowerCase() === 'true';
    console.log(isAscendingOrder);
    return this.userService.findUsersSortedByAge(isAscendingOrder);
  }

  @Get('/criteria/search/')
  async findUsersByCriteria(
    @Query('age') rawAge: string,
    @Query('city') city: string,
  ): Promise<User[]> {
    const age = +rawAge;
    console.log(age, city);
    const criteria = { age, city };
    return this.userService.findUsersByCriteria(criteria);
  }

  @Put(':userId/updateField/:field')
  async updateSpecificField(
    @Param('userId') userId: string,
    @Param('field') field: string,
    @Body('value') value: any,
  ): Promise<User> {
    return this.userService.updateSpecificField(userId, field, value);
  }

  @Get()
  async getAll() {
    return this.userService.getAllUsers();
  }

  @Put(':id')
  async updateUserById(@Param('id') id: string, @Body() updateUser: any) {
    return this.userService.updateUserById(id, updateUser);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('addSkill_ToUser/:userId/add-skill')
  async addSkill_ToUser(
    @Param('userId') userId: string,
    @Body('skill') skill: string,
  ): Promise<User> {
    return this.userService.addSkill_ToUser(userId, skill);
  }
}
