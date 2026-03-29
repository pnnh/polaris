export class DirectoryModel {
  pk = ''
  title = ''
  create_time = ''
  update_time = ''
  owner = ''
  description = ''
  parent = ''
  level = 0
  notebook = ''
  notebook_name = ''
  name = ''
  profile = ''
  profile_name = ''
  path = ''
  children: DirectoryModel[] = []
}
