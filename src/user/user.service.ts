import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getAllUsers() {
    return this.userModel.find();
  }
  

  async getOne(id) {
    return this.userModel.findById(id);
  }

  async updateUserById(id: string, updateUser: any) {
    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      updateUser,
      { new: true },
    );
  }

  async deleteUser(id: String) {
    return this.userModel.findByIdAndDelete({ _id: id });
  }

  // query users based on a specific field
  async findUserByUserName(firstName: string): Promise<User> {
    return this.userModel.findOne({ firstName });
  }

  //to limit the number of returned results in a query
  async findLimitedUsers(limit: number): Promise<User[]> {
    return this.userModel.find().limit(limit);
  }

  //to sort the results of a query in ascending or descending order
  async findUsersSortedByAge(ascending: boolean): Promise<User[]> {
    const sortOrger = ascending ? 1 : -1;
    return this.userModel.find().sort({ age: sortOrger });
  }

  // to perform complex queries using logical AND/OR conditions
  async findUsersByCriteria(criteria: {
    age: number;
    city: string;
  }): Promise<User[]> {
    const query = {
      age: +criteria.age,
      'address.city': criteria.city,
    };
    console.log('Query:', query);

    return this.userModel.find(query);
  }

  // to handle pagination for querying a large set of users

  async findUsersWithPagination(
    page: number,
    pageSize: number,
  ): Promise<User[]> {
    const skip = (page - 1) * pageSize;
    return this.userModel.find().skip(skip).limit(pageSize);
  }

  //to update a specific field in a user document
  async updateSpecificField(
    userId: string,
    field: string,
    value: any,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { [field]: value },
      { new: true },
    );
  }

  //to perform a text search on user data
  async searchUsersByText(query: string): Promise<User[]> {
    return this.userModel.find({ $text: { $search: query } });
  }

  //to perform an aggregation using MongoDB's aggregation pipeline
  async aggregateUserStatistics(): Promise<any> {
    return this.userModel.aggregate([
      {
        $group: {
          _id: '$address.city',
          averageAge: { $avg: '$age' },
          totalUsers: { $sum: 1 },
        },
      },
    ]);
  }

  //to use mongoose population for referencing documents from another collection?
  async getUserWithAddress(userId: string): Promise<User[]> {
    try {
      return this.userModel.findById(userId).populate('address');
    } catch (error) {
      console.error('Error in searchUserByText:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findUsersWithAgeGreaterThan(age: number): Promise<User[]> {
    return this.userModel.find({ age: { $gt: age } });
  }

  //to perform wildcard text searches using regular expressions
  async searchUsersByWildcard(query: string): Promise<User[]> {
    const regex = new RegExp(query, 'i');
    return this.userModel.find({
      $or: [{ firstName: regex }, { username: regex }],
    });
  }

  // to use the $in operator to find users with specific values in an array field
  async findUsersInCity(cities: string[]): Promise<User[]> {
    console.log(cities, 'cities');
    return this.userModel.find({
      'address.city': { $in: cities },
    });
  }

  //to update multiple documents at once using the $set operator
  async updateMultipleUsers(
    criteria: { jobTitle: string },
    updates: { $set: { jobTitle: string } },
  ): Promise<void> {
    await this.userModel.updateMany(criteria, updates);
  }

  // to use the $elemMatch operator to query arrays within documents if doc has "skills": ["JavaScript", "React", "Node.js"] then we can check in skills array in that perticualr skill is there or not
  async findUsersWithSpecificSkill(skill: string) {
    const caseInsensitiveSkill = new RegExp(skill, 'i');
    return this.userModel.find({
      skills: { $elemMatch: { $regex: caseInsensitiveSkill } },
    });
  }

  //to use the $addToSet operator to add unique elements to an array in a document
  //used to add elements to an array field in a document, but only if the elements are not already present in the array. It ensures that each element in the array is unique.
  async addSkillToUser(userId: string, skill: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { skills: skill } },
      { new: true },
    );
  }

  //to perform a case-insensitive sort on a specific field in a query
  async sortUsersByNameCaseInsensitive(): Promise<User[]> {
    return this.userModel
      .find()
      .sort({
        lastname: 'asc',
      })
      .collation({ locale: 'en', strength: 2 });
  }

  //to use the $all operator to find documents with an array containing all specified elements
  async findUsersWithAllSkills(requiredSkills: string[]): Promise<User[]> {
    return this.userModel.find({ skills: { $all: requiredSkills } });
  }

  //to use Mongoose's $redact operator for field-level access control
  async redactSensitiveData(userId: string): Promise<any> {
    return this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $redact: {
          $cond: {
            if: { $eq: ['$isSensitive', true] }, // if doc has isSensitive true it doest go in response
            then: '$$PRUNE',
            else: '$$DESCEND',
          },
        },
      },
    ]);
  }

  //to use Mongoose's $lookup operator for performing a left outer join
  async getUsersWithAddresses(): Promise<any> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'address',
          localField: '_id',
          foreignField: 'userId',
          as: 'address',
        },
      },
    ]);
  }

  //to use Mongoose's $expr operator for querying with aggregation expressions
  async findUsersWithSameFirstNameAndLastName(): Promise<User[]> {
    return this.userModel.find({
      $expr: { $eq: ['$firstName', '$lastName'] },
    });
    //expr operator in MongoDB to compare the firstName and lastName fields for equality.
  }

  //to use Mongoose's $bucket operator for creating buckets based on a field's value range
  async bucketUsersByAge(): Promise<any> {
    return this.userModel.aggregate([
      // {
      //   $match: {
      //     age: { $gte: 95, $lt: 99 }, // Adjust based on your boundaries
      //   },
      // },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [95, 99],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            users: { $push: '$$ROOT' },
          },
        },
      },
    ]);
  }

  // to perform a text search with weights on specific fields using Mongoose
  async weightedTextSearch(query: string): Promise<User[]> {
    return this.userModel
      .find(
        { $text: { $search: query, $language: 'en', $caseSensitive: false } },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } });
    //This function is useful when you want to perform a text search and retrieve results in order of relevance to the provided query. The relevance score (textScore) helps rank the documents based on how well they match the search criteria.
  }

  //to perform a compound query with logical AND and OR conditions in Mongoose
  async compoundQuery(conditions: {
    $and: any[];
    $or: any[];
  }): Promise<User[]> {
    try {
      const result = await this.userModel.find({
        $and: conditions.$and,
        $or: conditions.$or,
      });

      return result;
    } catch (error) {
      console.error('Error in compoundQuery:', error);
      throw error; // rethrow the error to propagate it further
    }
  }

  // to use Mongoose's lean() method for lightweight query results?
  async getLeanUsers(): Promise<any[]> {
    return this.userModel.find().lean();
    //The lean() method, when applied to a query, instructs Mongoose to return plain JavaScript objects instead of Mongoose documents This makes the query faster and consumes less memory because you're skipping the overhead of Mongoose documents.
  }

  //to use Mongoose's $ne operator for querying documents with a field not equal to a specific value
  async findUsersNotInCity(city: string): Promise<User[]> {
    console.log(city, 'city');
    return this.userModel.find({
      'address.city': { $eq: city },
    });
  }

  //to use Mongoose's $exists operator for querying documents with a specific field existence
  async findUsersWithEmail(email: string): Promise<User[]> {
    return this.userModel.find({ email: { $exists: true } });
  }

  // to use Mongoose's $slice operator for limiting the array elements returned in a query
  async findUsersWithLimitedSkills(limit: number): Promise<User[]> {
    // Find all users and then limit the skills array for each user
    const users = await this.userModel.find();

    // Modify the skills array for each user to have at most 'limit' elements
    const usersWithLimitedSkills = users.map((user) => {
      return {
        ...user.toJSON(),
        skills: user.skills.slice(0, limit),
      };
    });

    return usersWithLimitedSkills;
  }

  // not working
  //to use Mongoose's $size operator for querying documents with an array of a specific size?
  async findUsersWithSpecificNumberOfSkills(
    skillCount: number,
  ): Promise<User[]> {
    try {
      return this.userModel.aggregate([
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            // Add other fields you need in the result
            skills: 1,
            skillCount: { $size: '$skills' },
          },
        },
        {
          $match: {
            $and: [
              { skillCount: skillCount },
              { skills: { $ne: [] } }, // Check for non-empty skills array
            ],
          },
        },
      ]);
    } catch (error) {
      console.error('Error in findUsersWithSpecificNumberOfSkills:', error);
      throw error;
    }
  }

  //to use Mongoose's $regex operator with an array of patterns for complex queries
  async findUsersByMultiplePatterns(patterns: string[]): Promise<User[]> {
    try {
      const regexPatterns = patterns.map((pattern) => new RegExp(pattern, 'i'));
      const query = {
        $or: regexPatterns.map((regex) => ({ firstName: { $regex: regex } })),
      };

      return this.userModel.find(query);
    } catch (error) {
      console.error('Error in findUsersByMultiplePatterns:', error);
      throw error; // rethrow the error for proper handling
    }

    //Let's consider a scenario where a user wants to search for other users in the system based on partial or complete first names. This function allows flexibility by accepting multiple patterns
  }

  //to use Mongoose's $max and $min operators for finding the maximum and minimum values in a field
  async findOldestAndYoungestUsers(): Promise<{
    oldest: User;
    youngest: User;
  }> {
    const oldestUser = await this.userModel.findOne(
      {},
      {},
      { sort: { age: -1 } },
    );
    const youngestUser = await this.userModel.findOne(
      {},
      {},
      { sort: { age: 1 } },
    );
    return { oldest: oldestUser, youngest: youngestUser };
  }

  //to use Mongoose's $and and $or operators together for complex query logic
  async complexQueryWithAndOr(
    age: number,
    city: string,
    jobTitle: string,
  ): Promise<User[]> {
    return this.userModel.find({
      $and: [
        { age: age },
        {
          $or: [{ 'address.city': city }, { jobTitle: jobTitle }],
        },
      ],
    });
  }

  //to use Mongoose's $type operator for querying documents with a specific data type in a field
  async findUsersWithPhoneNumber(): Promise<User[]> {
    return this.userModel.find({
      phoneNumber: { $type: 'number' },
    });
  }

  //to use Mongoose's $push operator for adding elements to an array field in a document
  async addSkill_ToUser(userId: string, skill: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $push: { skills: skill } },
      { new: true },
    );

    // here it allows dublicates
  }

  // to use Mongoose's $unset operator for removing a field from a document?
  async removeAvatarFromUser(userId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $unset: { avatar: 1 },
      },
      { new: true },
    );
  }

  //to use Mongoose's $rename operator for renaming a field in a document
  async renameFieldInUser(userId: string, newFieldName: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $rename: { username: newFieldName } },
      { new: true },
    );
  }

  //to use Mongoose's $elemMatch operator with $ne for querying arrays with specific conditions?
  async findUsersWithSpecificSkillNotInCity(
    skill: string,
    city: string,
  ): Promise<User[]> {
    return this.userModel.find({
      skills: {
        $elemMatch: {
          $eq: skill,
        },
      },
      'address.city': { $regex: city, $options: 'i' },
    });

    //This function could be useful when you want to find users with a specific skill who are not located in a particular city. For example, finding developers with a certain skill set who are available for remote work.
  }

  //to use Mongoose's $where operator for querying documents with custom JavaScript conditions
  async findUsersWithCustomCondition(customCondition: string): Promise<User[]> {
    return this.userModel.find({ $where: customCondition });

    //This function is highly flexible and can be used when you have specific conditions that cannot be expressed easily using regular MongoDB query operators. It provides the freedom to use custom JavaScript expressions to filter the results based on your unique requirements.
  }

  // to use Mongoose's $expr with $in and $nin operators for advanced filtering
  async findUsersWithExprAndInAndNin(
    age: number,
    cities: string[],
  ): Promise<User[]> {
    try {
      const query = {
        $expr: {
          $and: [
            { $eq: ['$age', age] },
            { $in: ['$address.city', cities] },
            {
              $not: {
                $in: ['$jobTitle', ['Manager', 'CEO']],
              },
            },
          ],
        },
      };
      console.log('MongoDB Query:', query);
      return this.userModel.find(query);
    } catch (error) {
      console.error('Error in findUsersWithExprAndInAndNin:', error);
      throw error;
    }
  }

  //to use Mongoose's $merge operator for aggregating data into a new collection
  async mergeUsersIntoNewCollection(): Promise<void> {
    await this.userModel.aggregate([
      {
        $match: {
          age: { $gte: 25 },
        },
      },
      { $merge: { into: 'newUsers' } },
    ]);
  }

  //to use Mongoose's $facet operator for parallel processing of multiple aggregation pipelines
  async facetUsersByAgeAndCity(): Promise<{ byAge: User[]; byCity: User[] }> {
    const result = await this.userModel.aggregate([
      {
        $facet: {
          byAge: [
            { $match: { age: { $gte: 25 } } },
            { $project: { _id: 0, firstName: 1, lastName: 1, age: 1 } },
          ],
          byCity: [
            {
              $match: {
                'address.city': { $regex: 'Bangalore', $options: 'i' },
              },
            },
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                'address.city': 1,
              },
            },
          ],
        },
      },
    ]);

    // Explicitly cast the result to the expected type
    return result as unknown as { byAge: User[]; byCity: User[] };

    //This function uses the $facet stage in the MongoDB aggregation pipeline to perform multiple faceted searches in a single query.
    //This function could be useful when you want to retrieve specific information about users based on different criteria, such as age and city, within a single query.
  }

  //to use Mongoose's $type and $in operators for querying documents with specific data types and values\
  async findUsersWithTypeAndIn(
    age: number,
    phoneNumber: string,
  ): Promise<User[]> {
    console.log(age, 'age');
    console.log(phoneNumber, 'phoneNumber');
    return this.userModel.find({
      age: { $type: 'number', $gte: age },
      phoneNumber: { $type: 'string', $in: [phoneNumber] },
    });
  }

  //to use Mongoose's $switch operator for conditional processing in an aggregation pipeline
  async switchUserFieldsBasedOnCondition(condition: boolean): Promise<User[]> {
    return this.userModel.aggregate([
      {
        $project: {
          fullName: {
            $switch: {
              branches: [
                {
                  case: { $eq: [condition, true] },
                  then: { $concat: ['$firstName', ' ', '$lastName'] },
                },
              ],
              default: 'Name not available',
            },
          },
        },
      },
    ]);
  }

  //to use Mongoose's $group and $sum operators for aggregating data based on a field
  async groupAndSumUsersByAge(): Promise<{ _id: number; total: number }[]> {
    return this.userModel.aggregate([
      {
        $group: {
          _id: '$age',
          total: { $sum: 1 },
        },
      },
    ]);
  }

  //to use Mongoose's $bucketAuto for automatically creating buckets based on field values
  async autoBucketUsersByAge(): Promise<any[]> {
    return this.userModel.aggregate([
      { $bucketAuto: { groupBy: '$age', buckets: 2 } },
    ]);
    //This function utilizes the $bucketAuto stage to group users into buckets based on their age. The $bucketAuto stage automatically determines the bucket boundaries.
  }

  //to use Mongoose's $lookup with multiple pipelines for advanced data retrieval
  async lookupUsersWithAddressAndSkills(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'address',
          let: { userId: '$_id' },
          pipeline: [{ $match: { $expr: { $eq: ['$userId', '$$userId'] } } }],
          as: 'address',
        },
      },
      // {
      //   $lookup: {
      //     from: 'skills',
      //     let: { userId: '$_id' },
      //     pipeline: [
      //       { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
      //     ],
      //     as: 'skills',
      //   },
      // },
    ]);
  }

  //to use Mongoose's $facet with $unwind, $group, and $replaceRoot for multi-stage aggregations
  async facetWithUnwindAndGroup(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $facet: {
          ageDistribution: [
            { $unwind: '$age' },
            {
              $group: {
                _id: '$age',
                count: { $sum: 1 },
              },
            },
          ],

          cityDistribution: [
            { $unwind: '$address.city' },
            { $group: { _id: '$address.city', count: { $sum: 1 } } },
          ],
        },
      },
      {
        $project: {
          combinedResult: {
            $concatArrays: ['$ageDistribution', '$cityDistribution'],
          },
        },
      },
    ]);
  }

  //to use Mongoose's $lookup with $let and $eq for advanced data retrieval within a pipeline
  async lookupWithLetAndEq(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'address',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $gte: ['$zipCode', '500001'] },
                  ],
                },
              },
            },
          ],
          as: 'addressss', // address should give other name other wise it wil nt come
        },
      },
    ]);
  }

  //to use Mongoose's $lookup with $mergeObjects for combining data from different collections
  async lookupWithMergeObjects(userId: string): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'address',
          localField: '_id',
          foreignField: 'userId',
          as: 'addresses',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ['$addresses', 0] }, '$$ROOT'],
          },
        },
      },
    ]);
  }

  // to use Mongoose's $sample for retrieving random documents from a collection?
  async sampleRandomUsers(count: number): Promise<User[]> {
    return this.userModel.aggregate([{ $sample: { size: count } }]);
  }

  // not imp leave
  // to use Mongoose's $merge with $expr for merging documents based on a condition
  async mergeWithExprCondition(userId: string): Promise<User[]> {
    return this.userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $merge: {
          into: 'mergedCollection',
          whenMatched: {
            $expr: { $eq: ['$isMerged', true] },
          },
        },
      } as any,
    ]);
  }

  //to use Mongoose's $sort with $meta for sorting based on text search relevance
  async sortTextSearchResults(query: string): Promise<User[]> {
    return this.userModel
      .find(
        { $text: { $search: query, $language: 'en', $caseSensitive: false } },
        { score: { $meta: 'textScore' } },
      )
      .sort({ score: { $meta: 'textScore' } });

    //This function is useful when you want to perform a text search on user data and retrieve the results sorted by relevance. It's commonly used in scenarios where you want to prioritize more relevant search results based on textual matches.
  }

  // to use Mongoose's $facet with $unwind and $sortByCount for advanced data analysis
  async facetWithUnwindAndSortByCount(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $facet: {
          skillsDistribution: [
            { $unwind: '$skills' },
            { $sortByCount: '$skills' },
          ],
          ageDistribution: [{ $unwind: '$age' }, { $sortByCount: '$age' }],
        },
      },
    ]);
  }

  // to use Mongoose's $bucket and $sum for categorizing and aggregating data
  async bucketAndSumByAgeRange(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $bucket: {
          groupBy: '$age', // Group documents by the 'age' field
          boundaries: [20, 30, 40, 50, 90], // Define the age boundaries for bucketing
          default: 'Other', // Default bucket label if age doesn't fall into specified boundaries
          output: {
            count: { $sum: 1 }, // Calculate the count of documents in each bucket
          },
        },
      },
    ]);
  }

  //to use Mongoose's $replaceRoot and $arrayToObject for reshaping documents
  async replaceRootAndArrayToObject(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $replaceRoot: {
          newRoot: {
            $arrayToObject: {
              $map: {
                input: { $objectToArray: '$$ROOT' },
                as: 'field',
                in: {
                  k: { $concat: ['value_', '$$field.k'] },
                  v: '$$field.v',
                },
              },
            },
          },
        },
      },
    ]);
  }

  // to use Mongoose's $function for executing a JavaScript function during aggregation
  async executeCustomFunction(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $project: {
          customField: {
            $function: {
              body: function (a, b) {
                return a + b;
              },
              args: [10, 20],
              lang: 'js',
            },
          },
        },
      },
    ]);
  }

  // to use Mongoose's $lookup with $let, $eq, and $ifNull for advanced data retrieval within a pipeline
  async lookupWithLetEqIfNull(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'address',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$userId', '$$userId'] }],
                },
              },
            },
          ],
          as: 'primaryAddress',
        },
      },
      {
        $project: {
          primaryAddress: {
            $ifNull: [{ $arrayElemAt: ['$primaryAddress', 0] }, {}],
          },
        },
      },
    ]);
  }

  //to use Mongoose's $lookup with $unwind, $group, and $replaceRoot for denormalizing nested arrays
  async lookupWithUnwindGroupReplaceRoot(userId: string): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: 'userId',
          as: 'skills',
        },
      },
      {
        $unwind: '$skills',
      },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          skills: { $push: '$skills' },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$$ROOT', { skills: '$skills' }],
          },
        },
      },
    ]);
  }

  // not working
  //to use Mongoose's $function with $map, $filter, and $reduce for custom array transformations
  async functionWithMapFilterReduce(): Promise<any[]> {
    try {
      return this.userModel.aggregate([
        {
          $project: {
            modifiedArray: {
              $function: {
                body: function (skills: string[]) {
                  return skills
                    .map((skill) => skill.toUpperCase())
                    .filter((skill) => skill.includes('JS'))
                    .reduce((acc, skill) => {
                      acc.push({ modifiedSkill: skill, value: true });
                      return acc;
                    }, []);
                },
                args: ['$skills'],
                lang: 'js',
              },
            },
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  //to use Mongoose's $facet with $bucket and $sortByCount for comprehensive data analysis
  async facetWithBucketAndSortByCount(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $facet: {
          ageDistribution: [
            {
              $bucket: {
                groupBy: '$age',
                boundaries: [20, 30, 40],
                default: 'Other',
                output: {
                  count: { $sum: 1 },
                },
              },
            },
          ],
          skillDistribution: [
            { $unwind: '$skills' },
            { $sortByCount: '$skills' },
          ],
        },
      },
      {
        $project: {
          combinedResult: {
            $concatArrays: ['$ageDistribution', '$skillDistribution'],
          },
        },
      },
    ]);
  }

  //to use Mongoose's $expr with $allElementsTrue and $map for checking if all elements in an array match a condition
  async exprWithAllElementsTrue(): Promise<User[]> {
    return this.userModel.find({
      $expr: {
        $allElementsTrue: {
          $map: {
            input: ['JavaScript', 'React', 'Node.js', 'php', 'data analyst'], // Skills you're looking for
            as: 'requiredSkill',
            in: { $in: ['$$requiredSkill', '$skills'] }, // Check if each required skill is in the user's skills
          },
        },
      },
    });
  }

  // to use Mongoose's $bucket with $sum and $cond for conditional bucketing of data
  async bucketWithSumAndCond(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $bucket: {
          groupBy: '$age', // Group users by their 'age' field
          boundaries: [20, 30, 40], // Define the age boundaries for the buckets
          default: 'Other', // Default bucket if age doesn't fall into defined boundaries
          output: {
            count: { $sum: 1 }, // Count the number of users in each bucket
            totalSkills: {
              $sum: {
                $cond: {
                  // Conditional expression
                  if: { $gte: ['$skills.length', 2] }, // If the user has 2 or more skills
                  then: '$skills.length', // Sum the total number of skills
                  else: 0, // If not, set the totalSkills to 0
                },
              },
            },
          },
        },
      },
    ]);
  }

  //to use Mongoose's $lookup with $unwind, $group, and $project for denormalizing nested arrays and calculating averages
  async lookupWithUnwindGroupProject(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'skills', // Lookup the 'skills' collection
          localField: '_id', // Match the local field '_id' with the foreign field 'userId'
          foreignField: 'userId',
          as: 'skills', // Store the matched skills in the 'skills' array
        },
      },
      {
        $unwind: '$skills', // Unwind the 'skills' array, creating a new document for each skill
      },
      {
        $group: {
          _id: '$_id', // Group by user ID
          firstName: { $first: '$firstName' }, // Take the first 'firstName' in the group
          lastName: { $first: '$lastName' }, // Take the first 'lastName' in the group
          averageSkillExperience: { $avg: '$age' }, // Calculate the average of the 'age' field in the group
        },
      },
      {
        $project: {
          _id: 1, // Include the user ID in the result
          fullName: { $concat: ['$firstName', ' ', '$lastName'] }, // Concatenate 'firstName' and 'lastName' as 'fullName'
          averageSkillExperience: 1, // Include the calculated average skill experience in the result
        },
      },
    ]);
  }

  //use Mongoose's $facet with $bucketAuto, $sortByCount, and $limit for dynamic data analysis and ranking
  async facetWithBucketAutoSortByCountLimit(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $facet: {
          ageDistribution: [{ $bucketAuto: { groupBy: '$age', buckets: 5 } }],
          topSkills: [
            { $unwind: '$skills' },
            { $sortByCount: '$skills' },
            { $limit: 3 },
          ],
        },
      },
      {
        $project: {
          combinedResult: {
            $concatArrays: ['$ageDistribution', '$topSkills'],
          },
        },
      },
    ]);
  }

  //to use Mongoose's $facet with $lookup, $unwind, and $group for parallel processing and data enrichment
  async facetWithLookupUnwindGroup(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $facet: {
          enrichedData: [
            {
              $lookup: {
                from: 'enrichments',
                localField: 'username',
                foreignField: 'username',
                as: 'enrichment',
              },
            },
            { $unwind: '$enrichment' },
            {
              $group: {
                _id: '$_id',
                username: { $first: '$username' },
                enrichedField: { $first: '$enrichment.enrichedField' },
              },
            },
          ],
          ageDistribution: [{ $bucketAuto: { groupBy: '$age', buckets: 5 } }],
        },
      },
      {
        $project: {
          combinedResult: {
            $concatArrays: ['$enrichedData', '$ageDistribution'],
          },
        },
      },
    ]);
  }

  // to use Mongoose's $lookup with $addFields, $slice, and $reduce for array transformations during data retrieval?
  async lookupWithAddFieldsSliceReduce(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders',
        },
      },
      {
        $addFields: {
          latestOrders: {
            $slice: [
              {
                $reduce: {
                  input: '$orders',
                  initialValue: { latestDate: new Date(0), latestOrders: [] },
                  in: {
                    $cond: {
                      if: { $gt: ['$$this.date', '$$value.latestDate'] },
                      then: {
                        latestDate: '$$this.date',
                        latestOrders: ['$$this'],
                      },
                      else: {
                        latestDate: '$$value.latestDate',
                        latestOrders: {
                          $concatArrays: ['$$value.latestOrders', ['$$this']],
                        },
                      },
                    },
                  },
                },
              },
              5,
            ],
          },
        },
      },
    ]);
  }

  //to use Mongoose's $lookup with $unwind, $group, and $project for denormalizing nested arrays and calculating statistical measures?
  async lookupWithUnwindGroupProjectStatistics(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'scores',
          localField: '_id',
          foreignField: 'userId',
          as: 'scores',
        },
      },
      {
        $unwind: '$scores',
      },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          averageScore: { $avg: '$scores.score' },
          maxScore: { $max: '$scores.score' },
          minScore: { $min: '$scores.score' },
        },
      },
      {
        $project: {
          _id: 1,
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
          averageScore: 1,
          maxScore: 1,
          minScore: 1,
        },
      },
    ]);
  }

  // to use Mongoose's $lookup with $unwind, $group, and $addFields for denormalizing nested arrays and calculating weighted sums?
  async lookupWithUnwindGroupAddFieldsWeightedSum(): Promise<any[]> {
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: 'userId',
          as: 'skills',
        },
      },
      {
        $unwind: '$skills',
      },
      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          totalWeightedSum: {
            $sum: {
              $multiply: ['$skills.experience', '$skills.weight'],
            },
          },
        },
      },
      {
        $addFields: {
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
        },
      },
    ]);
  }
}
