require 'sqlite3'
require 'active_record'

ActiveRecord::Base.establish_connection(
  adapter: 'sqlite3',
  database: './bible.sqlite3'
)

#=begin
ActiveRecord::Schema.define do
  create_table :categories, force: true do |t|
    t.integer :category_index
    t.string :name
  end
  create_table :books, force: true do |t|
    t.integer :book_index
    t.string :name
    t.string :full_name
    t.integer :chapters
    t.integer :verses
    t.integer :category_id
  end
  create_table :book_names, force: true do |t|
    t.integer :book_id
    t.string :name
  end
  create_table :versions, force: true do |t|
    t.string :code
    t.string :name
  end
  create_table :domains, force: true do |t|
    t.string :domain
  end
  create_table :version_sources, force: true do |t|
    t.integer :domain_id
    t.integer :version_id
    t.string :url
    t.text :page
  end
  create_table :book_sources, force: true do |t|
    t.integer :version_source_id
    t.integer :book_id
    t.string :url
    t.text :page
  end
  create_table :chapter_sources, force: true do |t|
    t.integer :book_source_id
    t.integer :book_id
    t.integer :chapter
    t.string :url
    t.text :page
  end
  create_table :version_verses, force: true do |t|
    t.integer :chapter_source_id
    t.integer :book_id
    t.integer :chapter
    t.integer :verse
    t.string :url
    t.text :html
    t.text :content
  end
end
#=end

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end

class Category < ApplicationRecord
  has_many :books
end

class Book < ApplicationRecord
  belongs_to :category
end

class BookName < ApplicationRecord
  belongs_to :book
end

class Version < ApplicationRecord
  has_many :version_sources
end

class Domain < ApplicationRecord
  has_many :version_sources
end

class VersionSource < ApplicationRecord
  belongs_to :domain
  belongs_to :version
  has_many :book_sources
end

class BookSource < ApplicationRecord
  belongs_to :version_source
  belongs_to :book
  has_many :chapter_sources
end

class ChapterSource < ApplicationRecord
  belongs_to :book_source
  belongs_to :book
  has_many :verse_sources
end

class VersionVerse < ApplicationRecord
  belongs_to :chapter_source
  belongs_to :book
end

#=begin
load 'books.rb'
load 'versions.rb'
#=end

#require 'net/http'
require 'nokogiri'   
require 'open-uri'

$missing_book_names = Hash.new

def scrapeDomain(code, domain_name)
  version = Version.find_by code: code
  if version.nil?
    puts "No version found with code #{code}"
    return
  end
  domain = Domain.find_by domain: domain_name
  if domain.nil?
    puts "Domain #{domain_name} not found"
    return
  end
  version_source = VersionSource.find_by version_id: version.id, domain_id: domain.id
  if version_source.nil?
    puts "No version_source found for version #{version.code} and domain #{domain.domain}"
    return
  end
  if version_source.page.nil?
    page = Nokogiri::HTML(open(version_source.url))
    version_source.page = page.to_s
  else
    page = Nokogiri::HTML.parse(version_source.page)
  end
  #version_source.page = Net::HTTP.get(URI(version_source.url)).encode('UTF-8', 'ASCII-8BIT', invalid: :replace, undef: :replace)
  version_source.save()
  if domain_name == 'biblestudytools'
    index = 1
    page.css("#testament-O a, #testament-N a").each do |a|
      href = a["href"]
      m = href.match(/\.com(\/(?<code>[a-z]{2,4}))?\/(?<book>[1-3A-Za-z-]+)/)
      book_name = m[:book]
      if book_name[0] == '1' or book_name[0] == '2' or book_name[0] == '3'
        book_name = book_name[0..1] + book_name[2].upcase + book_name[3..-1]
      else
        book_name = book_name[0].upcase + book_name[1..-1]
      end
      #puts book_name
      book = Book.find_by name: book_name
      #book = Book.find_by book_index: index
      if book.nil?
        alt_book_name = BookName.find_by name: book_name
        if not alt_book_name.nil?
          book = alt_book_name.book
        end
      end
      if book.nil?
        #puts "book #{book_name} not found for version #{code} on domain #{domain_name}"
        $missing_book_names[book_name] = {index: index, code: code}
      else
        #puts book.full_name
        book_source = BookSource.find_by version_source_id: version_source.id, book_id: book.id
        if book_source.nil?
          BookSource.create version_source_id: version_source.id, book_id: book.id, url: href
        end
      end
      index = index + 1;
    end
  end
end

def scrapeBook(code, domain_name, book_name)
  version = Version.find_by code: code
  if version.nil?
    puts "No version found with code #{code}"
    return
  end
  domain = Domain.find_by domain: domain_name
  if domain.nil?
    puts "Domain #{domain_name} not found"
    return
  end
  version_source = VersionSource.find_by version_id: version.id, domain_id: domain.id
  if version_source.nil?
    puts "No version_source found for version #{code} and domain #{domain_name}"
    return
  end
  book = Book.find_by name: book_name
  if domain.nil?
    puts "Book #{book_name} not found"
    return
  end
  book_source = BookSource.find_by version_source_id: version_source.id, book_id: book.id
  if version_source.nil?
    puts "No book_source found for version #{code}, domain #{domain_name} and book #{book_name}"
    return
  end
  if book_source.page.nil?
    page = Nokogiri::HTML(open(book_source.url))
    book_source.page = page.to_s
  else
    page = Nokogiri::HTML.parse(book_source.page)
  end
  #version_source.page = Net::HTTP.get(URI(version_source.url)).encode('UTF-8', 'ASCII-8BIT', invalid: :replace, undef: :replace)
  book_source.save()
  if domain_name == 'biblestudytools'
    page.css("a[href]").each do |a|
      href = a["href"]
      m = href.match(/(https:\/\/www.biblestudytools.com)?\/((?<code>[a-z]{2,4})\/)?(?<book>[1-3a-z-]+)\/(?<chapter>[0-9]+)\.html/)
      if m.nil?
        #puts "url #{href} does not match regex"
      elsif m[:code] != code
        puts "url #{href} is for defferent version"
      elsif m[:book] != book_name.downcase
        puts "url #{href} is for defferent book"
      else
        chapter_number = m[:chapter].to_i
        #puts chapter_number
        chapter_source = ChapterSource.find_by book_source_id: book_source.id, book_id: book.id, chapter: chapter_number
        if chapter_source.nil?
          ChapterSource.create book_source_id: book_source.id, book_id: book.id, chapter: chapter_number, url: href
        end
      end
    end
  end
end

def scrapeChapter(code, domain_name, book_name, chapter_number)
  version = Version.find_by code: code
  if version.nil?
    puts "No version found with code #{code}"
    return
  end
  domain = Domain.find_by domain: domain_name
  if domain.nil?
    puts "Domain #{domain_name} not found"
    return
  end
  version_source = VersionSource.find_by version_id: version.id, domain_id: domain.id
  if version_source.nil?
    puts "No version_source found for version #{code} and domain #{domain_name}"
    return
  end
  book = Book.find_by name: book_name
  if domain.nil?
    puts "Book #{book_name} not found"
    return
  end
  book_source = BookSource.find_by version_source_id: version_source.id, book_id: book.id
  if book_source.nil?
    puts "No book_source found for version #{code}, domain #{domain_name} and book #{book_name}"
    return
  end
  chapter_source = ChapterSource.find_by book_source_id: book_source.id, book_id: book.id, chapter: chapter_number
  if chapter_source.nil?
    puts "No chapter_source found for version #{code}, domain #{domain_name}, book #{book_name} and chapter #{chapter_number}"
    return
  end
  if chapter_source.page.nil?
    page = Nokogiri::HTML(open(chapter_source.url))
    chapter_source.page = page.to_s
  else
    page = Nokogiri::HTML.parse(chapter_source.page)
  end
  #version_source.page = Net::HTTP.get(URI(version_source.url)).encode('UTF-8', 'ASCII-8BIT', invalid: :replace, undef: :replace)
  chapter_source.save()
  if domain_name == 'biblestudytools'
    page.css(".verse").each do |verse|
      verse_number = verse.css(".verse-number")[0].content.to_i
      verse_text = verse.css("span")[1]
      version_verse = VersionVerse.find_by chapter_source_id: chapter_source.id, book_id: book.id, chapter: chapter_number, verse: verse_number
      if version_verse.nil?
        VersionVerse.create chapter_source_id: chapter_source.id, book_id: book.id, chapter: chapter_number, verse: verse_number, html: verse_text.children.to_html, content: verse_text.text
      end
    end
  end
end

#scrapeDomain('kjv', 'biblestudytools')
#scrapeDomain('nkjv', 'biblestudytools')
#scrapeDomain('niv', 'biblestudytools')

#=begin
VersionSource.all.each do |version_source|
  version = version_source.version
  puts version.code
  domain = version_source.domain
  if domain.domain == 'biblestudytools'
    puts "scraping: version: #{version.code} domain: #{domain.domain}"
    scrapeDomain(version.code, 'biblestudytools')
    sleep 1
  end
end
File.open("missing_book_names.csv", "w") do |f|
  f.write "book,version,name\n"
  $missing_book_names.each do |book_name,data|
    f.write "#{data[:index]},\"#{data[:code]}\",\"#{book_name}\"\n"
  end
end

#=end

#scrapeBook('kjv', 'biblestudytools', 'Genesis')

#scrapeChapter('kjv', 'biblestudytools', 'Genesis', 50)

#version = Version.find_by code: 'niv'
#domain = Domain.find_by domain: 'biblestudytools'
#version_source = VersionSource.find_by version_id: version.id, domain_id: domain.id
#puts version_source.page